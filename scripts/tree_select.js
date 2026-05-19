const selectAll = document.getElementById("selectAllTreesCheck")
const fruitOptions = document.querySelectorAll(".ff-fruit-option-check")

selectAll.addEventListener("change", function() {
    fruitOptions.forEach(function(checkbox) {
        checkbox.checked = selectAll.checked;
    })
})

// function