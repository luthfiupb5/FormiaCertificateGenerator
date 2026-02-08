# Leenox - The Ultimate Bulk Certificate Generator 🚀

[![Leenox](https://img.shields.io/badge/Leenox-2.0-violet?style=for-the-badge&logo=rocket)](https://leenox.watermelonbranding.in)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**Leenox** is a high-performance, browser-based tool designed to solve the pain of bulk certificate generation. Forget mail merge and clunky software. Leenox lets you design beautiful certificates visually, map data from CSV/Excel, and generate thousands of print-ready PDFs in seconds—all directly in your browser.

🌐 **Live Demo:** [leenox.watermelonbranding.in](https://leenox.watermelonbranding.in)

---

## ✨ Features

### 🎨 **Visual Design Editor**
- **Drag & Drop**: Place text, images, and QR codes anywhere on your canvas.
- **Layer Management**: Lock, hide, and reorder layers with pro-level precision.
- **Custom Fonts**: Upload your own font files or use our curated Google Fonts library.
- **Smart Alignment**: Snap-to-grid and alignment tools for pixel-perfect layouts.

### ⚡ **Data Handling**
- **CSV & Excel Import**: Drag and drop your recipient list. We handle the parsing.
- **Dynamic Variables**: Map columns (e.g., `{{Name}}`, `{{Date}}`) to text layers instantly.
- **QR Code Generation**: Automatically generate unique QR codes for each recipient based on data.

### 🚀 **Performance Engine**
- **Client-Side Rendering**: Generates 100+ certificates per second using optimized Canvas rendering.
- **Bulk Export**: Download as a single ZIP file containing organized PDFs or Images.
- **High Resolution**: Export print-ready files (300 DPI support).

### ☁️ **Cloud & Security**
- **Project Storage**: Save your templates and mapping configurations to the cloud.
- **Secure**: Data processing happens locally or securely via encrypted streams. No data selling.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Animations**: GSAP (GreenSock) + Lenis Scroll
- **Backend/Auth**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **PDF Generation**: `jspdf` + `html2canvas` (Custom implementation)

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/leenox.git
   cd leenox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📱 Screenshots

| Landing Page | Editor Interface |
|:---:|:---:|
| ![Landing](https://placehold.co/600x400/101010/FFFFFF?text=Landing+Page) | ![Editor](https://placehold.co/600x400/101010/FFFFFF?text=Editor+Interface) |

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://twitter.com/luthfi_bassam">Luthfi Bassam</a></p>
</div>
