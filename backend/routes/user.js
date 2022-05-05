const express = require("express");
const pool = require("../config");
const app = express()
const cors = require('cors');
app.use(cors());



router = express.Router();

router.get("/users", async function (req, res, next) {
    try {
        let query = `select *
        from USER`
        const [rows, _] = await pool.query(query);
        res.send(rows)
    } catch (error) {
        return res.status(500).json(error)

    }
})

router.post('/user/login', async function (req, res, next) {
    const username = req.body.username
    const password = req.body.password

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        // Check if username is correct
        const [users] = await conn.query(
            'SELECT * FROM USER WHERE username=?',
            [username]
        )
        const user = users[0]
        if (!user) {
            throw new Error('Incorrect username or password')
        }

        // Check if password is correct
        const [passwords] = await conn.query('select password from USER where username=?', [username])
        const pasw = passwords[0]
        if (!pasw) {
            throw new Error('Incorrect username or password')
        }


        conn.commit()
        res.json(user)
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }


})

router.post('/user/signup', async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const phone = req.body.phone
    const address = req.body.address
    const postcode = req.body.postcode


    try {
        const [rows, _] = await conn.query(`select * from USER`)
        const user = rows
        const exitedUser = (user.filter((r) => r.username == username)[0])
        const exitedPassword = (user.filter((r) => r.password == password)[0])
        const exitedEmail = (user.filter((r) => r.email == email)[0])
        if (exitedUser == undefined && exitedPassword == undefined && exitedEmail == undefined) {
            await conn.query(`insert into USER(username, password, first_name, last_name, email, user_type, phone) values(?, ?, ?, ?, ?, 'customer', ?)`,
                [username, password, firstname, lastname, email, phone])
            await conn.query(`insert into CUSTOMER values((select user_id from USER where username = ?))`, [username])
            await conn.query(`insert into ADDRESS(user_id, address, postcode) values((select user_id from USER where username = ?), ?, ?)`, [username, address, postcode])
            conn.commit()
            res.send('successfully insert')
        } else {
            conn.rollback()
            res.send('error')
        }
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }




})

router.post('/user/creatCart/:userId', async function (req, res, next) {
    const userId = req.params.userId

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        const [rows, _] = await conn.query(`select * from CART`)
        const exitCart = rows.filter((c) => c.customer_id == userId)
        if (exitCart.length == 0) {
            const [row, _] = await conn.query(`select * from ADDRESS where user_id=?`, [userId])
            await conn.query(`insert into CART(createdate, total_price, customer_id, admin_id, address_no) values(current_date, 0, ?, 1, ?)`, [userId, row[0].address_no])
            console.log('insert cart')
            const [cart] = await conn.query(`select * from CART where customer_id=?`, [userId])
            console.log('query success')
            conn.commit()
            res.json(cart)
        } else if (exitCart.length != 0) {
            res.send('already have cart')
        }



    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }
})

router.get('/user/cart/:userId', async function (req, res, next) {
    const userId = req.params.userId

    try {
        const [rows, _] = await pool.query(`SELECT * FROM CART where customer_id=?`, [userId])
        res.json(rows)
    } catch (error) {
        res.status(400).json(error.toString())
    }
})

router.get('/user/cart/total/:userId', async function (req, res, next) {
    const userId = req.params.userId

    try {
        const [rows, _] = await pool.query(`SELECT sum(total_price) total_price FROM CART where customer_id=?`, [userId])
        res.json(rows)
    } catch (error) {
        res.status(400).json(error.toString())
    }
})

router.get('/user/cart_item/:userId', async function (req, res, next) {
    const userId = req.params.userId

    try {
        const [rows, _] = await pool.query(`SELECT image_url1, title, book_id, price, sum(quantity) quantity
        FROM CART 
        join CART_ITEM ct using (cart_id) 
        join BOOK using (book_id)
        WHERE customer_id=?
        group by book_id`, [userId])
        res.json(rows)
    } catch (error) {
        res.status(400).json(err.toString())
    }
})

router.put('/user/forgetPassword', async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    const username = req.body.username
    const password = req.body.confirmpassword

    try {
        const [rows, _] = await conn.query(`select * from USER where username=?`, [username])
        const user = rows[0]
        if (user.password != password) {
            console.log('old password:' + user.password)
            console.log('new password:'+ password)

            await conn.query(`update USER set password = ? where username = ?`, [password, username])
            conn.commit()
            res.send('update succesful!')
        } else {
            conn.rollback()
            res.send('error')
        }
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }

})

router.get("/users/:userId", async function (req, res, next) {
    const userId = req.params.userId

    try {
        let query = `select *
        from USER where user_id=?`
        const [rows, _] = await pool.query(query, [userId]);
        res.send(rows)
    } catch (error) {
        return res.status(500).json(error)

    }
})

router.post("/addAuthor", async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const alias = req.body.alias
    
    const [row, _] = await conn.query(`select * from AUTHOR where alias=?`, [alias])
    console.log(row)

        try {
            if (row.length == 0) {
            await conn.query(`insert into AUTHOR(alias, first_name, last_name) values(?, ?, ?)`, [alias, firstname, lastname])

            conn.commit()
            res.send('update succesful!')}
            else{
                res.send('error')
            }

        } catch (error) {
            conn.rollback()
            res.status(400).json(error.toString())
        } finally {
            conn.release()
        }
    })

router.delete("/deleteFromCart/:userId/:bookId/:cartId", async function (req, res, next) {
    const userId = req.params.userId
    const bookId = req.params.bookId
    const cartId = req.params.cartId

    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        const [rows2, field2] = await conn.query(`select * from CART_ITEM where cart_id=? AND book_id=?`, [cartId, bookId])
        await conn.query(`delete from CART_ITEM where cart_id=? AND book_id=?`, [cartId, bookId])
        const [rows1, field1] = await conn.query(`select * from BOOK where book_id=?`, [bookId])
        await conn.query(`update BOOK set unit=? where book_id=?`, [rows1[0].unit + rows2[0].quantity, bookId])
        const [row, field] = await conn.query(`select sum(unit_price*quantity) as total from CART_ITEM where cart_id = ? group by (cart_id)`, [cartId]);
        if (row.length == 0){
            await conn.query(`update CART set total_price = 0 where cart_id = ?`, [cartId])
        }else{
            await conn.query(`update CART set total_price = ? where cart_id = ?`, [row[0].total, cartId])
        }
        
        conn.commit()
        const [rows, _] = await pool.query(`SELECT * FROM CART join CART_ITEM using (cart_id) join BOOK using (book_id) where customer_id=?`, [userId])
        res.json(rows)
    } catch (error) {
        conn.rollback()
        console.log(error)
    } finally {
        conn.release()
    }
})

router.post("/addBookToCart/:userId/:bookId/:cartId", async function (req, res, next) {
    const userId = req.params.userId
    const bookId = req.params.bookId
    const cartId = req.params.cartId
    const unit_price = req.body.unit_price
    const quantity = req.body.quantity

    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        await conn.query(`insert into CART_ITEM(cart_id, unit_price, quantity, book_id) values(?, ?, ?, ?)`, [cartId, unit_price, quantity, bookId])
        const [rows, _] = await conn.query(`select * from BOOK where book_id=?`, [bookId])
        await conn.query(`update BOOK set unit=? where book_id=?`, [rows[0].unit - quantity, bookId])
        const [row, field] = await conn.query(`select sum(unit_price*quantity) as total from CART_ITEM where cart_id = ? group by (cart_id)`, [cartId]);
        await conn.query(`update CART set total_price = ? where cart_id = ?`, [row[0].total, cartId])
        console.log(row[0].total)
        conn.commit()
        res.send('เพิ่มสินค้าลงตะกร้าแล้ว')
    } catch (error) {
        conn.rollback()
        res.send(error)
    }finally {
        conn.release()
    }
})

router.put('/addPub', async function (req, res, next){
    const pub_name = req.body.pubName
    const pub_phone1 = req.body.pubPhone1
    const pub_phone2 = req.body.pubPhone2
    const pub_url = req.body.pubURL
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        if (pub_phone2 != ""){
            await conn.query(`insert into PUBLISHER(pub_name, pub_phone1, pub_phone2, pub_url)`, [pub_name, pub_phone1, pub_phone2, pub_url])
        }else if (pub_phone2 == ""){
            await conn.query(`insert into PUBLISHER(pub_name, pub_phone1, pub_url)`, [pub_name, pub_phone1, pub_url])
        }
        conn.commit()
        res.send('เพิ่มข้อมูลสำเร็จ')
    } catch (error) {
        conn.rollback()
        console.log(error)
    }finally {
        conn.release()
    }
})

router.put('/updateAddress/:userId', async function (req, res, next) {
    const userId = req.params.userId;
    const address = req.body.address
    const postcode = req.body.postcode

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        if (address != "" && postcode != ""){
            await conn.query(`update ADDRESS set address=? where user_id = ?`, [address, userId])
            await conn.query(`update ADDRESS set postcode=? where user_id = ?`, [postcode, userId])
        }
        else if (address != ""){
            await conn.query(`update ADDRESS set address=? where user_id = ?`, [address, userId])
        }
        else if (postcode != ""){
            await conn.query(`update ADDRESS set postcode=? where user_id = ?`, [postcode, userId])
        }
        conn.commit()
        const [rows, _] = await pool.query(`select * from ADDRESS where user_id = ?`, [userId])
        res.json(rows)
    } catch (error) {
        conn.rollback()
        console.log(error)
    }finally {
        conn.release()
    }
})

router.get('/address/:userId', async function (req, res, next) {
    const userId = req.params.userId
    try {
        const [rows, _] = await pool.query(`select * from ADDRESS where user_id = ?`, [userId])
        res.json(rows)
    } catch (error) {
        console.log(error)
    }
})

router.get('/order', async function (req, res, next) {
    const [rows, _] = await pool.query('select cart_id, title, quantity, price, first_name, last_name, address, phone from CART join CART_ITEM using (cart_id) join BOOK using (book_id) join ADDRESS on (CART.customer_id = ADDRESS.user_id) join USER using (user_id) order by cart_id DESC')
    res.json(rows)
})

exports.router = router
