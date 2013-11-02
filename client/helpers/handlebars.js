Handlebars.registerHelper('TabActive', function (route) {
    return (route == Session.get("current_page")) ? "active" : "";
});