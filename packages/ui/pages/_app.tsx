import React from 'react';
import Head from 'next/head';
import App, { AppInitialProps, AppContext } from 'next/app';
import { Store } from '@reduxjs/toolkit';
import { NextPageContext } from 'next';
import { AppState, wrapper } from '../redux-store';

import '../index.css';

export interface Context extends NextPageContext {
    store: Store<AppState>;
}

class MyApp extends App<AppInitialProps> {
    public static getInitialProps = async ({ Component, ctx }: AppContext) => {
        return {
            pageProps: {
                ...(Component.getInitialProps
                    ? await Component.getInitialProps(ctx)
                    : {}),
                appProp: ctx.pathname,
            },
        };
    };

    public render() {
        const { Component, pageProps } = this.props;

        return (
            <>
                <Head>
                    <link rel="shortcut icon" href="" />
                    <title>Shop2Client</title>
                </Head>
                <Component {...pageProps} />
            </>
        );
    }
}

export default wrapper.withRedux(MyApp);
