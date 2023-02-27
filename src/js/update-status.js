(function () {
    const updateStatus = document.querySelectorAll(".update-status");
    const token = document.querySelector("meta[name='csrf-token']").getAttribute("content")

    updateStatus.forEach(button => {
        button.addEventListener("click", updatePropertyStatus)
    });

    async function updatePropertyStatus(event) {
        const { propertyId } = event.target.dataset;

        try {
            const url = `/properties/${propertyId}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "CSRF-Token": token
                }
            });

            const result = await response.json();

            if (result) {
                if (event.target.classList.contains("bg-yellow-100")) {
                    event.target.classList.add("bg-green-100", "text-green-800");
                    event.target.classList.remove("bg-yellow-100", "text-yellow-800");
                    event.target.textContent = "Published";
                } else {
                    event.target.classList.add("bg-yellow-100", "text-yellow-800");
                    event.target.classList.remove("bg-green-100", "text-green-800");
                    event.target.textContent = "Not published";
                }
            }

            console.log(result);
        } catch (error) {
            console.log("error");
        }
    }

})()