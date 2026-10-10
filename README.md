# Moon Talween (مون تلوين)

Coloring pages for children, ready to print, in Arabic and English. Pick drawings, say how you want them printed, and get a file made for your paper: one sheet that fills the page, two drawings to a sheet, or a whole coloring book with the child's name on the cover.

Everything runs in the browser. There is no server, and pictures you add never leave your device.

![The home page: the headline and the first drawings](./docs/home.jpg)

## What it does

### Drawings

- **38 original drawings** in six groups: characters, animals, the sea, nature and home, vehicles and space.
- **A page for every letter and number:** the 28 Arabic letters, A to Z, and 0 to 9, each as one large outline.
- **Add your own picture.** Any picture on your device can be printed the same way as the site's drawings. It is opened by the browser only and is gone when the page is closed.

![The characters](./docs/characters.jpg)

### Printing

- **One drawing, now.** Fill the sheet, or keep a margin with the drawing's name under it.
- **Two a sheet,** with a dashed line to cut along.
- **A coloring book.** Sheets printed on both sides and folded in half. The site puts every page where it has to go, so the folded stack reads in order, opening from the right in Arabic and from the left in English.
- **What will the child color with?** Pencils and crayons print on both sides. Felt pens and watercolors soak through, so in a book each drawing gets a leaf of its own, and the site says which paper to use.
- **Paper:** A4, Letter or A5. **Lines:** thick for little ones, medium or thin.
- **Print directly or download a PDF.** Both come from the same pages, and the previews on screen are drawn by the same code, so what you see is what prints.

![Setting up a book: the drawings, the choices and the preview](./docs/book.jpg)

![The PDF of a six-drawing book: four sides of two sheets, in the order that folds into a book](./docs/booklet-pdf.jpg)

## How it is built

- [React 18](https://react.dev) with [Vite](https://vite.dev), [React Router 7](https://reactrouter.com) and [Tailwind CSS 3](https://tailwindcss.com)
- No backend and no other dependencies: the page layout, the booklet ordering and the PDF file are written in this repository

Some decisions worth knowing:

- **A drawing is a few lines of SVG** in a 200 by 200 box (`src/drawings/`). Shapes are white with a black outline unless marked as an open line or a solid dot, which keeps every area closed and ready to color.
- **Planning is separate from drawing.** `plan()` in `src/lib/plan.js` takes the chosen drawings and settings and returns plain data: the pages, their size in millimetres, and what sits in each rectangle. It can be tested without a browser.
- **Booklet order.** For a book of N pages, sheet k carries pages N−2k and 2k+1 on one side and 2k+2 and N−2k−1 on the other. A test folds the sheets in code and checks the pages come out 1, 2, 3 and so on, for both reading directions.
- **One renderer.** `src/lib/render.js` draws a planned page on a canvas. It makes the small previews at screen size and the printed pages at 200 dots per inch.
- **The PDF is written by hand** (`src/lib/pdf.js`): each page is one JPEG at the page's real size, wrapped in the few objects a PDF needs.
- **Printing** places the same page pictures in the document where only the printer sees them, and sets the paper size to match.
- **Letters are type, not drawings.** Each is one glyph outlined at double width and then filled, which gives a clean outline and hides the places where a letter's own strokes overlap.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Limits

- Printers differ in how close to the edge they can print. Pages keep 7 mm clear, and "actual size" must be chosen in the print window.
- Printing a book on both sides needs "flip on short edge". A printer that prints one side only needs the stack turned by hand; the How to print page explains it.
- Pictures you add are kept only while the page is open.
