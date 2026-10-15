import { MotionConfig } from 'motion/react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { CheckoutLayout } from './components/layout/CheckoutLayout'
import { RootLayout } from './components/layout/RootLayout'
import { CheckoutPage } from './pages/Checkout'
import { HomePage } from './pages/Home'
import { InfoPage } from './pages/InfoPage'
import { JournalPage } from './pages/Journal'
import { JournalPostPage } from './pages/JournalPost'
import { NotFoundPage } from './pages/NotFound'
import { OrderConfirmationPage } from './pages/OrderConfirmation'
import { ProductPage } from './pages/Product'
import { RouteError } from './pages/RouteError'
import { ShopPage } from './pages/Shop'

/**
 * Routes. Store pages share RootLayout (header, footer, bag drawer);
 * checkout and the confirmation use the quieter CheckoutLayout.
 */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'products/:slug', element: <ProductPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'journal/:slug', element: <JournalPostPage /> },
      { path: 'pages/:slug', element: <InfoPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <CheckoutLayout />,
    errorElement: <RouteError />,
    children: [
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order/:orderId', element: <OrderConfirmationPage /> },
    ],
  },
])

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  )
}
