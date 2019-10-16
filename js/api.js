function int10to62(n) {
    const c = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';var s = "";
    do {
        m = n % 62;
        n = (n - m) / 62;
        s = c.charAt(m) + s;
    }
    while (n);
    return s;
}
function generateId() {
    return 'xxx'.replace(/x/g, (c) => { return (Math.random() * 36 | 0).toString(36); })
    + ("0x" + new Date().getTime().toString(16) << 1).toString(36).replace(/^-/, "")
}

function delOne(list, v) {
    for (i in list) {
        if (list[i].innerHTML === v) {
            list[i].parentNode.removeChild(list[i])
        }
    }
}
//b.a===false默认降序打印,b.b===false默认不绑定dblclick
function objParse(parent, v, b) {
    var li = document.createElement("li"); li.innerHTML = v;
    li.style = "background:#fff;border:1px solid #ccc";
    if (b&&b.b)
        li.addEventListener("dblclick", function () {
            if ('room'.Id().innerHTML === "") so.emit("create or join", v)
            else alert("你已经在一个房间了！")
        })
    if (b && b.a)li.addEn(parent.Id())
    else li.addIn(parent.Id());
}
function listParse(parent, v, b) {
    parent = parent.Id(); parent.innerHTML = "";
    for (i in v) {
        var li = document.createElement("li"); li.innerHTML = v[i];
        li.style = "background:#fff;border:1px solid #ccc";
        if (b&&b.b) {
            li.addEventListener("dblclick", function () {
                if ('room'.Id().innerHTML === "") so.emit("create or join", this)
                else alert("你已经在一个房间了！")
            }.bind(v[i]))
        }
        if (b && b.a) li.addEn(parent)
        else li.addIn(parent);
    }
}
function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var img = 'PicTure'.Id().getElementsByTagName("a")[0].cloneNode(true),
            parent = 'menulist'.Id()
        if (parent.firstChild) {
            parent.insertBefore(img, parent.firstChild);
        } else {
            parent.appendChild(img);
        } img = img.getElementsByTagName("img")[0];
        img.src = (window.URL || window.webkitURL).createObjectURL(file);
    }
}
var reader = new FileReader(), fil = 'menulist'.Id();
fil.addEventListener('dragover', function (ev) {
    ev.preventDefault();
}, false)
fil.addEventListener('drop', function (ev) {
    ev.stopPropagation();
    ev.preventDefault();
    handleFiles(ev.dataTransfer.files);
}, false)