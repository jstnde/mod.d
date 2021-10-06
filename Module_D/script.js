async function get(url) {
    const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Singapore&appid=773cec3cb3f6597c426deac741eccc3b")

    try {
        if (!response.ok) {
            throw "Unable to retrieve valid response."
        }
    }
    catch(err) {
        alert(err)
        window.location.reload()
    }

    return await response.json()
}

// --- Multiple Choice ---

function mcqLoad() {
    const json = get("multiple")
    json.then(data => {
        let obj = {
            "records": [
                {
                    "question": "What do you call the young of a dog",
                    "options": ["kitten","puppy","kid"],
                    "answer": 2
                },
                {
                    "question": "What do you call the young of a cat",
                    "options": ["kitten","puppy","kid"],
                    "answer": 1
                }
            ]
        }
        let list = []
        for (const record of obj.records) {
            list.push(record)
        }
        let val = 0
        mcqUpdate(list, val)
    })
}

function mcqUpdate(list, val) {
    const alpha = "abcdefghijklmnopqrstuvwxyz"
    let total_questions = list.length
    let answer
    let use = document.getElementById("use").value.split("")
    if (use[0] === "") {
        use = []
    }
    console.log(use)

    if (use.length < total_questions) {
        let random
        do {
            random = Math.floor(Math.random() * total_questions).toString()
            if (!use.includes(random)) {
                use.push(random)
                break
            }
        } while (use.includes(random))

        let use_value = ""
        for (const u of use) {
            use_value += u
        }

        document.getElementById("use").value = use_value
        document.getElementById("score").innerText = "Score " + val + "/" + total_questions
        document.getElementById("question").innerText = use.length + ") " + list[random].question
        answer = list[random].options[list[random].answer - 1]
        console.log(answer)
        let options = []

        do {
            const random1 = Math.floor(Math.random() * list[random].options.length)
            if (!options.includes(list[random].options[random1])) {
                options.push(list[random].options[random1])
            }
        } while(options.length !== list[random].options.length)

        for (const option in options) {
            let div = document.createElement("div")
            div.classList.add("answer")

            let input = document.createElement("input")
            input.classList.add("options")
            input.type = "radio"
            input.name = "option"
            input.id = options[option]
            input.value = options[option]

            let label = document.createElement("label")
            label.setAttribute("for", options[option])
            label.id = options[option] + "Label"

            let span = document.createElement("span")
            span.innerHTML =  alpha[option] + ") " + options[option]

            label.appendChild(span)
            div.appendChild(input)
            div.appendChild(label)

            document.getElementById("answers").appendChild(div)
        }

        document.getElementById("submit").onclick = function() {
            const options = document.getElementsByClassName("options")
            for (const option of options) {
                if (option.checked) {
                    let label = document.getElementById(option.id + "Label")
                    if (option.value === answer) {
                        let box = document.createElement("span")
                        box.classList.add("res")
                        box.innerText = "Correct"
                        label.appendChild(box)
                        val++
                        document.getElementById("score").innerText = "Score " + val + "/" + total_questions
                    } else {
                        let box = document.createElement("span")
                        box.classList.add("res")
                        box.innerText = "Wrong"
                        label.appendChild(box)
                    }
                    for (const option1 of options) {
                        option1.disabled = true
                    }
                    document.getElementById("submit").disabled = true
                    setTimeout(function() {
                        document.getElementById("answers").innerHTML = ""
                        document.getElementById("submit").disabled = false
                        mcqUpdate(list, val)
                    }, 2000)
                }
            }
        }

        console.log(use)
        console.log(options)
    } else {
        if (val >= total_questions/2) {
            alert("Final Score: " + val + "/" + total_questions + "\nGood Job!")
        } else {
            alert("Final Score: " + val + "/" + total_questions + "\nNice Try!")
        }
        window.location = "index.html"
    }
}

// --- Drag n Drop ---

function dndLoad() {
    const json = get("dragndrop")
    json.then(data => {
        let obj = {
            "records": [
                {
                    "box": ["KITTEN","PUPPY","KID"],
                    "images": ["kitten.jpg","puppy.jpg","kid.jpg"],
                    "base_url": "wkXX.ws.org/quiz/"
                }
            ]
        }
        let list = []
        for (const record of obj.records) {
            list.push(record)
        }
        let val = 0
        dndUpdate(list, val)
    })
}

function dndUpdate(list, val) {
    for (const listElement of list) {
        let use = [], use1 = []
        let total_options = listElement.box.length

        document.getElementById("score").innerText = "Score " + val + "/" + total_options

        let random
        do {
            random = Math.floor(Math.random() * total_options).toString()
            if (!use.includes(random)) {
                use.push(random)
            }
        } while (use.length !== total_options)

        do {
            random = Math.floor(Math.random() * total_options).toString()
            if (!use1.includes(random)) {
                use1.push(random)
            }
        } while (use1.length !== total_options)

        console.log(use)
        console.log(use1)

        const dnd = document.getElementById("dnd_container")
        const dnd_img = document.getElementById("img_container")

        for (const option of use) {
            const answer_holder = document.createElement("div")
            answer_holder.classList.add("answer_holder")
            const span = document.createElement("span")
            span.innerText = listElement.box[option]
            span.classList.add("answer_span")
            const box = document.createElement("div")
            box.classList.add("answer_box")
            box.id = listElement.box[option]
            box.addEventListener("dragover", dragOver)
            box.addEventListener("drop", dragDrop)

            answer_holder.appendChild(span)
            answer_holder.appendChild(box)
            dnd.appendChild(answer_holder)
        }

        for (const option of use1) {
            const img_holder = document.createElement("div")
            img_holder.classList.add("img_holder")
            img_holder.draggable = true
            img_holder.addEventListener("dragstart", dragStart)
            img_holder.addEventListener("dragend", dragEnd)
            const img = document.createElement("img")
            img.src = "imgs\\" + listElement.images[option]
            img.draggable = false

            img_holder.appendChild(img)
            dnd_img.appendChild(img_holder)
        }

        function dragDrop() {
            console.log("Drag Drop")
            if (this.classList.value.includes("filled")) {
                return
            }
            let content
            let img_holders = document.getElementsByClassName("img_holder")
            for (const imgHolder of img_holders) {
                if (imgHolder.classList.value.includes("dragging")) {
                    content = "<div class='img_holder'>" + imgHolder.innerHTML + "</div>"
                    document.getElementById("img_container").removeChild(imgHolder)
                    const id = this.id
                    console.log(id)
                    this.classList.add("filled")
                    this.innerHTML = content

                    val += (dragCheck(imgHolder, id) ? 1 : 0)
                    let total_options = document.getElementsByClassName("answer_holder").length
                    document.getElementById("score").innerText = "Score " + val + "/" + total_options

                    if (total_options === document.getElementsByClassName("filled").length) {
                        setTimeout(() => {
                            if (val >= total_options/2) {
                                alert("Final Score: " + val + "/" + total_options + "\nGood Job!")
                            } else {
                                alert("Final Score: " + val + "/" + total_options + "\nNice Try!")
                            }
                            window.location = "index.html"
                        }, 0)
                    }
                }
            }
        }

        function dragCheck(imgHolder, id) {
            const src = imgHolder.firstChild.src.split("/")
            const img = src[src.length - 1]
            let answer_position
            let img_position

            for (const boxKey in listElement.box) {
                if (id === listElement.box[boxKey]) {
                    answer_position = boxKey
                }
            }

            for (const imagesKey in listElement.images) {
                if (img === listElement.images[imagesKey]) {
                    img_position = imagesKey
                }
            }

            return (answer_position === img_position)
        }
    }
}

function dragStart() {
    this.classList.add("dragging")
    console.log("Drag Start")
}

function dragEnd() {
    this.classList.remove("dragging")
    console.log("Drag End")
}

function dragOver(e) {
    e.preventDefault()
    console.log("Drag Over")
}

// --- Fill in the Blanks ---

function blankLoad() {
    const json = get("blanks")
    json.then(data => {
        let obj = {
            "records": [
                {
                    "question": "The Young of a dog is known as",
                    "answer": "puppy"
                },
                {
                    "question": "The Young of a cat is known as",
                    "answer": "kitten"
                },
                {
                    "question": "The Young of a goat is known as",
                    "answer": "kid"
                }
            ]
        }
        let list = []
        for (const record of obj.records) {
            list.push(record)
        }
        let val = 0
        blankUpdate(list, val)
    })
}

function blankUpdate(list, val) {
    const total_questions = list.length
    let use = []

    upScore()

    let random
    do {
        random = Math.floor(Math.random() * total_questions).toString()
        if (!use.includes(random)) {
            use.push(random)
        }
    } while (use.length !== total_questions)

    const parent_div = document.getElementById("blank_questions")
    for (const useKey in use) {
        let div = document.createElement("div")
        div.classList.add("blank_div")
        let no_span = document.createElement("span")
        no_span.innerText = parseInt(useKey) + 1 + ")"
        no_span.classList.add("no_span")
        let question_span = document.createElement("span")
        question_span.innerText = list[use[useKey]].question
        question_span.classList.add("question_span")
        let input = document.createElement("input")
        input.classList.add("blank_input")
        input.addEventListener("keypress", keyPress)
        input.id = use[useKey]

        div.appendChild(no_span)
        div.appendChild(question_span)
        div.appendChild(input)

        parent_div.appendChild(div)
    }

    let time = 60
    let counter = setInterval(function countdown() {
        const timer = document.getElementById("countdown")
        let txt
        time--
        if (time.toString().length < 2) {
            txt = "0" + time
        } else {
            txt = time
        }

        timer.innerText = "Time left : " + txt + " seconds"
        console.log(time)
        setTimeout(() => {
            if (time === 0) {
                clearInterval(counter)
                if (val >= total_questions/2) {
                    alert("Final Score: " + val + "/" + total_questions + "\nGood Job!")
                } else {
                    alert("Final Score: " + val + "/" + total_questions + "\nNice Try!")
                }
                window.location = "index.html"
            }
        }, 0)
    }, 1000)

    function keyPress(e) {
        setTimeout(() => {
            for (const listElement of list) {
                const questions = document.getElementsByClassName("question_span")
                for (const question of questions) {
                    if (question.parentElement === this.parentElement) {
                        if (question.innerText === listElement.question) {
                            this.value = this.value.toLowerCase()
                            if (this.value === listElement.answer) {
                                val += 1
                                this.disabled = true
                            }
                        }
                    }
                }
            }
            upScore()
        }, 0)
    }

    function upScore() {
        document.getElementById("score").innerText = "Score " + val + "/" + total_questions
        if (val === total_questions) {
            alert("Final Score: " + val + "/" + total_questions + "\nGood Job!")
            window.location = "index.html"
        }
    }
}

