import next from 'next';
import Router from 'next-routes';
import express from 'express';
import cors from 'cors';

const port = process.env.UI_PORT;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const router = new Router();

const expressApp = express();
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};
expressApp.use(cors(corsOptions));

router.add({
    name: 'registration',
    page: 'registration',
    pattern: '/registration',
});

const handler = router.getRequestHandler(app);

app.prepare().then(() => {
    expressApp.get('/healthz', (_, res) => {
        res.send({ ok: true });
    });

    expressApp.use(handler);

    expressApp.listen(port, () => {
        console.log(
            `> Server listening at http://localhost:${port} as ${
                dev ? 'development' : process.env.NODE_ENV
            }`,
        );
    });
    // tslint:disable-next-line:no-console
});
