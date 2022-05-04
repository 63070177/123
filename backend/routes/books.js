const express = require("express");
const pool = require("../config");
const app = express()
const cors = require('cors');

app.use(cors());

router = express.Router();

router.post("/book/search", async function (req, res, next) {
  console.log(req.body.search)
  try {
    const [rows, _] = await pool.query('SELECT * FROM BOOK WHERE title LIKE ?', [`%${req.body.search}%`])
    res.json(rows)
  } catch (error) {
    console.log(error)
  }
})

router.get("/books/:bookId", async function (req, res, next) {
  const bookId = req.params.bookId
  try {
    let query = `select *
        from BOOK
        join AUTHOR_BOOK
        using (book_id)
        join AUTHOR
        using (author_id)
        join BOOK_TYPE_BOOK
        using (book_id)
        join BOOK_TYPE
        using (book_type_id)
        join PUBLISHER
        using (pub_id)
        where book_id=?`
    const [rows, _] = await pool.query(query, [bookId]);
    res.send(rows)
  } catch (error) {
    return res.status(500).json(error)

  }
})

router.delete("/book/delete/:bookId", async function (req, res, next) {
  const bookId = req.params.bookId
  console.log(bookId)
  const conn = await pool.getConnection()
  await conn.beginTransaction()

  try {
    await conn.query(`delete from AUTHOR_BOOK where book_id=?`, [bookId])
    await conn.query(`delete from BOOK_TYPE_BOOK where book_id = ?`, [bookId])
    await conn.query(`delete from BOOK where book_id=?`, [bookId]);

    conn.commit()
    res.send('successfully delete')

  } catch (error) {
    conn.rollback()
    res.status(400).json(error.toString())
  } finally {
    conn.release()
  }
})

router.post("/book/selectType", async function (req, res, next) {
  console.log(req.body.selected)
  try {
    const [rows, _] = await pool.query(`select * 
        from BOOK
        join BOOK_TYPE_BOOK
        using (book_id)
        join BOOK_TYPE
        using (book_type_id)
        where name like ?`, [`%${req.body.selected}%`])
    res.json(rows)
  } catch (error) {
    console.log(error)
  }
})

router.post("/book/addBook", async function (req, res, next) {
  const title = req.body.bookname
  const description = req.body.text
  const unit = req.body.unit
  const price = req.body.price
  const isbn_num = req.body.isbn
  const pub_name = req.body.publisher
  const alias = req.body.authorname
  const frontpic = req.body.frontpic
  const backpic = req.body.backpic
  const barcode = req.body.barcode
  const typebook = req.body.typebook

  console.log(req.body)

  const [rows, field] = await pool.query(`SELECT * FROM PUBLISHER WHERE pub_name = ?`, [pub_name])
  const [rows1, field1] = await pool.query(`SELECT * FROM AUTHOR WHERE alias = ?`, [alias])
  const [rows2, field2] = await pool.query(`SELECT * FROM BOOK WHERE title = ?`, [title])
  const [rows3, field3] = await pool.query(`SELECT * FROM BOOK_TYPE WHERE name = ?`, [typebook])

  console.log(rows[0], rows1[0], rows3[0])

  const conn = await pool.getConnection()
  await conn.beginTransaction()

  try {
    if (rows.length != 0 && rows1.length != 0 && rows2.length == 0) {
      await conn.query(`INSERT INTO BOOK(title, description, unit, price, isbn_num, image_url1, image_url2, barcode, admin_id, pub_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`, [title, description, unit, price, isbn_num, frontpic, backpic, barcode, rows[0].pub_id])
      console.log('1')
      conn.commit()
      console.log('committed')

      const [rows4, field4] = await conn.query(`SELECT * FROM BOOK WHERE title = ?`, [title])
      await conn.query(`INSERT INTO AUTHOR_BOOK VALUES(?, ?, ?)`, [rows4[0].book_id, rows1[0].author_id, 'writer'])
      console.log('2')
      await conn.query(`INSERT INTO BOOK_TYPE_BOOK VALUES(?, ?)`, [rows4[0].book_id, rows3[0].book_type_id])
      console.log('3')
      res.send('เพิ่มข้อมูลสำเร็จ')

    }
  } catch (error) {
    conn.rollback()
    console.log(error)
  } finally {
    conn.release()
  }

})

router.post('/book/updateBook/:bookId', async function (req, res, next) {
  const title = req.body.bookname
  const description = req.body.text
  const unit = req.body.unit
  const price = req.body.price
  const isbn_num = req.body.isbn
  const pub_name = req.body.publisher
  const alias = req.body.authorname
  const frontpic = req.body.frontpic
  const backpic = req.body.backpic
  const barcode = req.body.barcode
  const typebook = req.body.typebook
  const bookId = req.params.bookId

  const [rows, fields] = await pool.query(`select * from PUBLISHER where pub_name=?`, [pub_name])
  const [rows1, fields1] = await pool.query(`select * from AUTHOR where alias=?`, [alias])
  const [rows2, field2] = await pool.query(`select * from BOOK_TYPE where name=?`, [typebook])


  const conn = await pool.getConnection()
  await conn.beginTransaction()

  try {
    if (rows != undefined && rows1 != undefined){
      await conn.query(`update BOOK set title=?, description=?, unit=?, price=?, isbn_num=?, image_url1=?, image_url2=?, barcode=?, pub_id=? where book_id=?`, [title, description, unit, price, isbn_num, frontpic, backpic, barcode, rows[0].pub_id, bookId])
      await conn.query(`update BOOK_TYPE_BOOK set book_type_id=? where book_id=?`, [rows2[0].book_type_id, bookId])
      await conn.query(`update AUTHOR_BOOK set author_id=? where book_id=?`, [rows1[0].author_id, bookId])
      conn.commit()
      res.send('เปลี่ยนแปลงข้อมูลสำเร็จ')
    }
    
  } catch (error) {
    conn.rollback()
    console.log(error)
    res.send('ชื่อผู้แต่ง หรือสำนักพิมพ์ไม่ถูกต้อง')
  }finally{
    conn.release()
  }

})

exports.router = router;