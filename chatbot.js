/* Copyright(c) 2016 Caleb Gentry alias epicTCK
 * Permission is hereby granted, free of charge,
 * to any person obtaining a copy  of this software
 * and associated documentation files(the "Software"),
 * to deal in the Software  without restriction,
 * including without limitation the rights to use,
 * copy, modify, merge, publish,  distribute, sublicense,
 * and / or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS  OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT  OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

class Bot {
  constructor(name, owner, ignoreOwn, reqPing) {
    this.name = name;
    this.owner = owner;
    this.reqPing = reqPing;
    this.ignoreOwn = ignoreOwn;
    this.modules = new Set();
    console.log("Bot created.")
  }
  chat(msg) {
    document.getElementById('input').value = msg.replace(/<\/?i>/g, "*");
    document.getElementById("sayit-button").click();
    console.log("message sent: " + msg);
  }

  getMessage(number) {
      var containers = document.getElementsByClassName("monologue");
      var container = containers[containers.length - number];
      var message = new Message(
        container.getElementsByClassName("username")[0].innerHTML,
        container.getElementsByClassName("content")[0].innerHTML,
        container.getElementsByClassName("stars")[0].children[0],
        ":" + container.getElementsByClassName("message")[0].id.split("-").pop()
      );
      console.log("Message returned: " + message.txt)
      return message;
    }
 
  loop() {
    while (this.run) {
      var message = this.getMessage(1);
      var prevMessage = this.getMessage(2);

      if (message.user == this.name && this.ignoreOwn) {
        return;
      }
      var messageL = message.txt.toLowerCase();

      if (this.reqPing && messageL.includes("@" +
          this.name.toLowerCase()) != true)
        return;
      if (message.txt == prevMessage.txt)
        return;
      for (let module of this.modules) module(this, message);
    }
  }

  stop() {
    this.run = false;
    console.log("Loop ended.")
  }
  start() {
    this.run = true;
    console.log("Loop started.");
    this.loop();
  }
  addModule(callback) {
    this.modules.add(callback);
    console.log("Module added: " + callback);
  }


}

function xkcd(bot, input) {

  if (input.txt.includes("xkcd")) {
    var split = input.txt.split(" ");
    var num = split[split.indexOf("xkcd") + 1];
    var url = "http://www.xkcd.com/" + num;
    if (url != "http://www.xkcd.com/NaN") {
      bot.chat(url);
    } else {
      bot.chat("Invalid input " + input.replyID); //thnx to downgoat on PPCG chat
    }
  }
}
var bot = new Bot("epicTCK", "epicTCK", false, true);
bot.addModule(xkcd);
