$(function () {
    $("#site-header").load("../parts/header.html", function () {

        $.get("/api/auth/me")
            .done(function (user) {
                // Logged in
                $("#nav-login").addClass("d-none");
                $("#nav-register").addClass("d-none");

                $("#nav-user").removeClass("d-none");
                $("#nav-logout").removeClass("d-none");

                $("#nav-username").text(user.username);
            })
            .fail(function () {
                // Logged out
                $("#nav-login").removeClass("d-none");
                $("#nav-register").removeClass("d-none");

                $("#nav-user").addClass("d-none");
                $("#nav-logout").addClass("d-none");
            });

    });
});
