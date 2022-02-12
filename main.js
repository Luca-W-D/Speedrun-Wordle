///////////////////////////////////////////
// Luca-W-D
// 2-12-2022
// Speed running Wordle (60min)
//
// Not meant to be beautiful, efficient,
// or at all optimized. This is simply
// a practice on developing with HTML,
// CSS, and JS in a short time frame.
///////////////////////////////////////////


///////////////////////////////////////////
// Horrifying amnt of globals

var currentRow = 0
var cell = 0
var word = words[Math.floor(Math.random() * words.length)]
var inputAllowed = true
var won = false

console.log(`Stuck? The word is ${word}`)

///////////////////////////////////////////
// On document load (thanks Zach for the shorthand)
$(() => {
    $(".cell-3d").each(function () { $(this)[0].innerHtml = "&nbsp;" })
    $(document).keypress(e => {
        var input = String.fromCharCode(e.which).toLowerCase()
        if (e.which == 13)
            onSubmit()
        var validInput = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
        if (validInput.indexOf(input) != -1)
            handleInput(input)
    })
    $(document).keydown(e => {
        if (e.keyCode == 8)
            onDelete()
    })
})

function handleInput(input) {
    if (!inputAllowed)
        return
    if (cell < 5 && currentRow < 5) {
        $($($(".row")[currentRow]).find(".cell-3d")[cell]).find(".letter").text(input.toUpperCase())
        cell++
    }
}

function isValidWord(thisWord) {
    return (words.indexOf(thisWord) != -1)
}

function onSubmit() {
    // https://www.w3schools.com/jsref/met_loc_reload.asp
    if (won)
        location.reload()
    if (getCurrentWord().length < 5)
        return
    if (!isValidWord(getCurrentWord()))
        return showInvalid()
    if (getCurrentWord() == word)
        return gotWord()
    missedGuess()
}

function gotWord() {
    inputAllowed = false
    won = true
    renderDiff([0, 0, 0, 0, 0])
    $(".HUD h2").text("Congrats! You got the word. Hit enter to play again.")
}

function showInvalid() {
    $($(".row")[currentRow]).animate({
        left: "-15px"
    }, 80).animate({
        left: "15px"
    }, 80).animate({
        left: 0
    }, 80)
}

function lostGame() {
    inputAllowed = false
    won = true
    $(".HUD h2").text(`Oh no! The answer was "${word}." Hit enter to play again.`)
}

function missedGuess() {
    inputAllowed = false
    var diff = compareWords(getCurrentWord())
    renderDiff(diff)
    setTimeout(() => {
        currentRow++
        if (currentRow == 5) {
            lostGame()
        }
        cell = 0
        setTimeout(() => { inputAllowed = true }, 250)
    }, 800)
}

///////////////////////////////////////////
// Horrific animations

function renderDiff(diff) {
    $({ deg: 0 }).animate({ deg: 90 }, {
        duration: 400,
        step: function (now) {
            for (var x = 0; x < diff.length; x++) {
                var thisCell = $($($(".row")[currentRow]).find(".cell-3d")[x])
                $(thisCell).css({
                    transform: 'rotateY(' + now + 'deg)'
                })
                $(thisCell).find(".cell-3d-inner").css({
                    transform: 'rotateY(' + now + 'deg)'
                })
            }
        }
    })
    setTimeout(() => {
        for (var x = 0; x < diff.length; x++) {
            var thisCell = $($($(".row")[currentRow]).find(".cell-3d")[x]).find(".cell-3d-front")
            thisCell.css("backgroundColor", (diff[x] != 0) ? (diff[x] != 2) ? "#F0E88D" : "#BBB" : "#8FF091")
        }
    }, 400)
    $({ deg: 90 }).delay(400).animate({ deg: 0 }, {
        duration: 400,
        step: function (now) {
            for (var x = 0; x < diff.length; x++) {
                var thisCell = $($($(".row")[currentRow]).find(".cell-3d")[x])
                $(thisCell).css({
                    transform: 'rotateY(' + now + 'deg)'
                })
                $(thisCell).find(".cell-3d-inner").css({
                    transform: 'rotateY(' + now + 'deg)'
                })
            }
        }
    })
}

function getCurrentWord() {
    var word = ""
    $($(".row")[currentRow]).find(".letter").each(function () { word += $(this).text() })
    return word.toLowerCase()
}

function onDelete() {
    if (cell == 0)
        return
    cell--
    $($($(".row")[currentRow]).find(".cell-3d")[cell]).find(".letter").text(" ")
}

function compareWords(currentWord) {
    var ret = []
    for (var x = 0; x < word.length; x++) {
        if (currentWord[x] == word[x])
            ret[x] = 0
        else if (word.indexOf(currentWord[x]) != -1)
            ret[x] = 1
        else
            ret[x] = 2
    }
    return ret
}