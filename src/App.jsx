import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { StoreProvider } from './lib/store.jsx'
import Activities from './pages/Activities.jsx'
import Book from './pages/Book.jsx'
import Crafts from './pages/Crafts.jsx'
import Home from './pages/Home.jsx'
import How from './pages/How.jsx'
import NotFound from './pages/NotFound.jsx'
import PrintOne from './pages/PrintOne.jsx'

// The same pages in both languages: Arabic at the root, English under /en.
const pages = () => (
  <>
    <Route index element={<Home />} />
    <Route path="print/:ref" element={<PrintOne />} />
    <Route path="activities" element={<Activities />} />
    <Route path="crafts" element={<Crafts />} />
    <Route path="book" element={<Book />} />
    <Route path="how" element={<How />} />
    <Route path="*" element={<NotFound />} />
  </>
)

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/en" element={<Layout lang="en" />}>
            {pages()}
          </Route>
          <Route path="/" element={<Layout lang="ar" />}>
            {pages()}
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
