import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Analytics } from '@vercel/analytics/react';
import { store } from './store';
import { AppRoutes } from './routes/AppRoutes';
import { ServerWakeupLoader } from './components/common/ServerWakeupLoader';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ServerWakeupLoader />
        <AppRoutes />
        <Analytics />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
