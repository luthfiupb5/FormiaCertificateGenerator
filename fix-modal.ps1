$file = 'f:\Formia\components\Dashboard\NewProjectModal.tsx'
$content = Get-Content $file -Raw

# Replace Supabase storage code with R2 code
$content = $content -replace "            // Upload Template to Supabase Storage\r\n            if \(templateFile\) \{\r\n                const fileExt = templateFile\.name\.split\('\\.'\)\.pop\(\);\r\n                const fileName = `template\.\$\{fileExt\}`;\r\n                const filePath = `\$\{user\.id\}/\$\{projectId\}/\$\{fileName\}`;\r\n                \r\n                const \{ error: uploadError, data \} = await supabase\.storage\r\n                    \.from\('projects'\)\r\n                    \.upload\(filePath, templateFile\);\r\n\r\n                if \(uploadError\) throw uploadError;\r\n                \r\n                // Get Public URL\r\n                const \{ data: \{ publicUrl \} \} = supabase\.storage\.from\('projects'\)\.getPublicUrl\(filePath\);\r\n                templateUrl = publicUrl;\r\n                templateStoragePath = filePath;\r\n            \}", @"
            // Helper: Upload to R2
            const uploadToR2 = async (file: File, folder: string) => {
                const fileExt = file.name.split('.').pop();
                const fileName = ``file-`${uuidv4()}.`${fileExt}``;
                const res = await fetch('/api/storage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: fileName, contentType: file.type, folder })
                });
                if (!res.ok) throw new Error(``Upload URL failed: `${await res.text()}``);
                const { uploadUrl, key } = await res.json();
                const uploadRes = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type }
                });
                if (!uploadRes.ok) throw new Error('R2 upload failed');
                return key;
            };

            // Upload Template to R2
            if (templateFile) {
                const key = await uploadToR2(templateFile, ``${user.id}/``${projectId}``);
                templateUrl = ``r2:`${key}``;
                templateStoragePath = key;
            }"@

$content | Set-Content $file -NoNewline
Write-Host "File updated successfully!"
