const express = require('express');
const app = express();
const path = require('node:path');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

app.set('view engine', 'ejs');
// publicディレクトリ以下のファイルを静的ファイルとして配信
app.use('/static', express.static(path.join(__dirname, 'public')));

const logMiddleware = (req, res, next) => {
    console.log(req.method, req.path);
    next();
}

app.get('/item/:id', logMiddleware, (req, res) => {
    // :idをreq.params.idとして受け取る
    res.status(200).send(req.params.id);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

async function main() {
    await client.connect();

    const db = client.db('my-app');

    app.get('/', logMiddleware, async (req, res) => {
        // const users = ['alpha', 'beta', 'gamma'];
        const items = await db.collection('item').find().toArray();
        const itemsList = items.map((item) => ({
            name: item.name,
            quantity: item.quantity
        }));


        res.render(path.resolve(__dirname, 'views/index.ejs'), { items: itemsList });
    });

    app.post('/api/item', express.json(), async (req, res) => {
        const { name, quantity } = req.body;
        if (!name || !quantity) {
            res.status(400).send('Bad Request');
            return;
        }
        await db.collection('item').insertOne({ name: name, quantity: quantity });
        res.status(200).send('Created');
    });

    // ポート: 3000でサーバーを起動
    app.listen(3000, () => {
        // サーバー起動後に呼び出されるCallback
        console.log('start listening');
    });
}
main();