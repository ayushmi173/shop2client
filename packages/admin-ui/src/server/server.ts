import next from 'next';
import Router from 'next-routes';
import express from 'express';

const port = process.env.ADMIN_WEB_PORT;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const router = new Router();

const expressApp = express();

router.add({
    name: 'login',
    page: 'login',
    pattern: '/login',
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
});
