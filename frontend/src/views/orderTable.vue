<template>
  <div>
    <nav
      class="navbar is-transparent"
      style="background-color: #6a7150; color: white"
    >
      <div class="navbar-brand">
        <div>
          <img
            class="logo"
            src="../klinnangsue_logo.svg"
            width="200"
            height="100"
          />
          <div class="logo-text">
            <span>Klinnangsue<br />ร้านกลิ่นหนังสือ</span>
          </div>
        </div>
      </div>
      <div class="navbar-start">
        <div class="navbar-item" style="margin-left: 40px">
          <a
            class="navbar-item g-navitem"
            style="margin-right: 50px; margin-left: 10px"
            @click="toHomePage()"
          >
            Book
          </a>
          <div class="navbar-item">
            <a class="navbar-item g-navitem"> Blind date with a book </a>
          </div>
        </div>
      </div>
      <div class="navbar-end" style="margin-right: 100px">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <a
                class="button is-primary"
                style="font-size: 1.5rem"
              >
                <span class="icon">
                  <i class="fa-solid fa-user"></i>
                </span>
                <span
                  >Hello, <b>{{ user.username }}</b></span
                >
              </a>
            </p>
          </div>
        </div>
      </div>
    </nav>
    <div class="container">
      <div class="columns">
        <div class="column">
          <div class="column is-4">
            <div class="box ubox">
              <a class="linkinP" href="#"><span style="color: black"> ดูคำสั่งซื้อ </span></a>
              <hr />
              <a class="linkinP" @click="toAddBook()"><span> เพิ่มข้อมูลหนังสือ</span></a>
              <hr />
              <a class="linkinP" @click="toAddAuthor()"
                ><span > เพิ่มข้อมูลผู้แต่ง </span></a
              >
              <hr />
              <a class="linkinP" @click="toAddPublisher()"
                ><span> เพิ่มข้อมูลสำนักพิมพ์ </span></a
              >
              <hr />
              <a class="linkinP" @click="toLogin()"
                ><span> ออกจากระบบ </span></a
              >
            </div>
          </div>
        </div>
        <div class="column is-8">
          <div class="box" style="margin-top: 60px">
            <table class="table">
              <thead>
                <tr>
                  <th>เลขที่คำสั่งซื้อ</th>
                  <th>หนังสือที่สั่งซื้อ</th>
                  <th>จำนวนหนังสือที่สั่ง</th>
                  <th>ราคารวม</th>
                  <th>ชื่อผู้สั่ง</th>
                  <th>ที่อยู่</th>
                  <th>เบอร์โทรศัพท์</th>
                  <th>ลบคำสั่งซื้อ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in cart" :key="order.item_no">
                  <td>{{ order.cart_id }}</td>
                  <td>{{ order.title }}</td>
                  <td>{{ order.quantity }}</td>
                  <td>{{ order.quantity * order.price }}</td>
                  <td>{{ order.first_name }} {{ order.last_name }}</td>
                  <td>{{ order.address }}</td>
                  <td>{{ order.phone }}</td>
                  <td>
                    <button
                      class="button is-danger"
                      @click="deleteOrder(order)"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <nav class="level k-level">
        <div class="level-item has-text-centered">
          <div>
            <p style="letter-spacing: 5" class="title has-text-white">
              Klinnangsue
            </p>
            <p style="letter-spacing: 5" class="title has-text-white">
              ร้านกลิ่นหนังสือ
            </p>
          </div>
        </div>
        <p class="level-item has-text-centered">
          <a class="link is-info has-text-white" @click="toHomePage()">ร้านหนังสือ</a>
        </p>
        <p class="level-item has-text-centered">
          <a class="link is-info has-text-white">แจ้งการโอนเงิน</a>
        </p>
        <p class="level-item has-text-centered">
          <a class="link is-info has-text-white">รู้จักเรา</a>
        </p>
        <p class="level-item has-text-centered">
          <a class="link is-info has-text-white">ติดต่อเรา</a>
        </p>
      </nav>

      <!-- Right side -->
      <div class="level-right" style="padding-right: 100px">
        <p class="level-item">
          <strong class="has-text-white">ติดตามข่าว ร้านกลิ่นหนังสือ</strong>
        </p>
      </div>
      <div class="level-right" style="padding-right: 100px">
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <input class="input" type="text" placeholder="EMAIL ADDRESS" />
            </p>
            <p class="control">
              <button class="button">SUBSCRIBE</button>
            </p>
          </div>
        </div>
      </div>

      <div class="level-right" style="padding-right: 100px">
        <div class="k-im-item">
          <i class="fa-brands fa-facebook"></i>
        </div>
        <div class="k-im-item">
          <i class="fa-brands fa-twitter"></i>
        </div>
        <div class="k-im-item">
          <i class="fa-brands fa-instagram"></i>
        </div>
      </div>

      <div class="level-right" style="padding-right: 100px">
        <p class="level-item">
          <a class="has-text-white">นโยบายความเป็นส่วนตัว</a>
        </p>
        <p class="level-item">
          <a class="has-text-white">นโยบายการส่งสินค้า</a>
        </p>
        <p class="level-item"><a class="has-text-white">นโยบายการคืนเงิน</a></p>
      </div>

      <p class="level-left" style="padding-left: 50px; padding-bottom: 20px">
        <a class="link is-info has-text-white"
          >Copyright©2020 Klinnangusue, All Rights Reserved.</a
        >
      </p>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "orderTable",
  data() {
    return {
      user: [],
      cart: []
    };
  },
  mounted() {
    const userId = this.$route.params.userId;
    axios.get(`http://localhost:3000/users/${userId}`).then((response) => {
      this.user = response.data[0];
    });
    axios.get(`http://localhost:3000/order`).then((response) => {
        this.cart = response.data
    })
  },
  methods: {
      deleteOrder(order) {
          const userId = order.user_id
          const bookId = order.book_id
          const cartId = order.cart_id
          var r = confirm("คณต้องการยืนยันที่จะยกเลิกออเดอร์หรือไม่");
      if (r == true) {
        axios.delete(`http://localhost:3000/deleteFromCart/${userId}/${bookId}/${cartId}`).then((response) => {
            this.cart = response.data
        }).catch((err) => {
            console.log(err)
        })
      }
  },
  toAddPublisher (){
      const userId = this.user.user_id
      this.$router.push(`/addPublisher/${userId}`)
    },toAddAuthor() {
        const userId = this.user.user_id
      this.$router.push(`/addAuthor/${userId}`)
    },
    toHomePage() {
        const userId = this.user.user_id
      this.$router.push(`/homePage/${userId}`)
    },
    toLogin() {
      this.$router.push(`/loginPage`);
    },
    toAddBook() {
      const userId = this.user.user_id
      this.$router.push(`/addDetailBook/${userId}`)
    }

    
  }
};
</script>

<style>
.gdeletebutt {
  border: none;
  padding: 10px;
  font-size: 1.2rem;
  border-radius: 10px;
}

.gsetedit {
  position: absolute;
  top: 0;
  right: 0;
  width: 135px;
}
.geditbutt {
  border: none;
  padding: 10px;
  font-size: 1.2rem;
  border-radius: 10px;
  float: left;
}

body {
  background-color: #f2e0c3;
}

footer {
  background-color: #6d7352;
}

.g-navitem {
  font-size: 2rem;
  color: white;
}

.clicktoblind {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: 400px;
  background-image: url("../founder.jpg");
  background-size: cover;
}

.boxtoblind {
  padding: 15px;
  position: absolute;
  z-index: 1;
  width: 400px;
  background-color: #6d7352;
  color: white;
  right: 50px;
  top: 100px;
  letter-spacing: 5px;
  font-weight: bold;
  font-size: 2rem;
}

.gbuttom {
  margin-top: 30px;
  color: white;
  background-color: #6d7352;
  width: 100%;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 20%;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.container {
  padding: 2px 16px;
}

.booktype {
  padding: 30px;
  font-size: 2rem;
  margin-left: 60px;
}

.index {
  display: block;
  border: none;
  background-color: transparent;
  font-size: 1.2rem;
}

.logo {
  width: 150px;
  padding-left: 60px;
  padding-top: 20px;
  margin-right: 30px;
}

.logo-text {
  position: relative;
  padding-left: 40px;
  text-align: center;
  letter-spacing: 3px;
}

.k-level {
  padding-top: 50px;
  margin-top: 50px;
  padding-right: 100px;
}

.k-im-item {
  font-size: 2rem;
}

.logo-text2 {
  letter-spacing: 15px;
  margin-top: 40px;
  margin-left: 100px;
  font-size: 2.5rem;
  color: #6d7352;
}

.logo2 {
  width: 150px;
  padding-left: 60px;
  padding-top: 20px;
  margin-right: 30px;
  margin-left: 100px;
}

.linkinP {
  color: #6d7352;
}

.linkinP:hover {
  color: black;
}

.ubox {
  width: 300px;
  margin-top: 50px;
}

.gbookstore {
  width: 300px;
  height: 50px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
  background-color: #bf9772;
  text-align: center;
  border: none;
  border-radius: 30px;
}

.glogo {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  width: 200px;
}

.glogo-text {
  letter-spacing: 15;
  font-size: 2.5rem;
  color: white;
}

.gbox {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  background-color: #6d7352;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
}

.gbookstore2 {
  width: 250px;
  height: 80px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  background-color: #bf9772;
  text-align: center;
  border: none;
  border-radius: 30px;
}

.gbutton {
  margin-top: 30px;
  text-align: center;
  background-color: none;
}

.gbutt {
  border: 2px solid #6d7352;
  font-size: 1.2rem;
  background-color: #f2e0c3;
  color: #6d7352;
  border-radius: 20px;
  width: 300px;
  height: 50px;
}
</style>