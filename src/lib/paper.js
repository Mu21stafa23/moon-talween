// Paper sizes in millimetres, and what each way of coloring asks of the paper.

export const papers = {
  a4: { id: 'a4', label: 'A4', width: 210, height: 297 },
  letter: { id: 'letter', label: 'Letter', width: 215.9, height: 279.4 },
  a5: { id: 'a5', label: 'A5', width: 148, height: 210 },
}

// `bleeds` means the color soaks through, so nothing is printed on the back of a drawing.
export const tools = {
  pencil: { id: 'pencil', bleeds: false },
  crayon: { id: 'crayon', bleeds: false },
  marker: { id: 'marker', bleeds: true },
  water: { id: 'water', bleeds: true },
}

// The outline's width, in the units of a drawing's 200 by 200 box.
// On an A4 sheet these print at about 5, 3.5 and 2.5 millimetres.
export const lines = { thick: 5, medium: 3.6, thin: 2.5 }

export const MM_PER_INCH = 25.4
export const POINTS_PER_MM = 72 / MM_PER_INCH
