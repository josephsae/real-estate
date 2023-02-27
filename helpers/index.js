const checkSellerStatus = (userId, propertyId) => {
    return userId === propertyId;
};

const formatDate = date => {
    const newDate = new Date(date).toISOString();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    return new Date(newDate).toLocaleDateString("en-EN", options)
};

export {
    checkSellerStatus,
    formatDate
};