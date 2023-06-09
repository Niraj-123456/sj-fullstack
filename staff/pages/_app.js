import Head from "next/head";
import "../styles/globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { persistor, store } from "../redux/app/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

// Font awesome icon appears huge in initital render
// configuration to prevent the above behavior
import "@fortawesome/fontawesome-svg-core/styles.css"; // import fontawesome css manually
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // prevent fontawesome fron adding css automatically

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Sahaj</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="shortcut icon" href="/sahaj_fav_100x100.png" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
