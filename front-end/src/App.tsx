import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRouteAdmin from "./common/ProtectedRouteAdmin";

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import ChatDetail from './pages/ChatDetail';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import { connectChatWebSocket } from '@/store/actions/chatActions';
import { connectWebSocketNotification,
  NOTIFICATION_WEBSOCKET_SEND_MESSAGE  } from './store/actions/notifyActions';
import { RootState } from '@/store'
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const userToken = useSelector((state: RootState)=> state.auth?.user?.token);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(connectChatWebSocket());
    dispatch(connectWebSocketNotification());
    dispatch({
      type: NOTIFICATION_WEBSOCKET_SEND_MESSAGE,
      payload : {
        token : userToken,
        type: "CONNECT",
      }
    });
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route element={<DefaultLayout />}>
          <Route index element={<ECommerce />} />
          <Route path="chat/:id" element={<ChatDetail />} /> {/* Dynamic route for chat rooms */}
          {routes.map((routes, index) => {
            const { path, component: Component, role } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    {role === "admin" ? (<ProtectedRouteAdmin ><Component /> </ProtectedRouteAdmin>) : <Component />}
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
}

export default App;
