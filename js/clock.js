function UpdateTime() {
    this.myDate = new Date();
    this.currenttime = $('#currenttime');
    this.currentdate = $('#currentdate');
    this.options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    };

    var treatedDate = this.myDate.toLocaleString("fr-FR", this.options);

    var date2 = treatedDate.split("à ")[0];
    var time = treatedDate.split("à ")[1];

   

    this.currentdate.text(date2);
    this.currenttime.text(time);
}
setInterval(UpdateTime, 1000);
