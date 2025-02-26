import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from 'App'
import 'config/i18n'
import 'index.css'
import reportWebVitals from 'reportWebVitals'
import { history, store } from 'store'

// initMockServiceWorker()

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
