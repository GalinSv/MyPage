$(function () {
    const $list = $("#comments-list");
    const $form = $("#comment-form");

    let currentOrder = "date";

    function formatDate(iso) {
        return new Date(iso).toLocaleString();
    }

    function loadUserAndComments() {
        $.get("/api/auth/me")
            .done(loadComments)
            .fail(() => {
                $form.hide();
                $list.before(
                    '<div class="alert alert-info">You must be logged in to leave comments.</div>'
                );
                loadComments();
            });
    }

    function loadComments() {
        $.get(`/api/comments?orderBy=${currentOrder}`).done(comments => {
            $list.empty();

            comments.forEach(c => {
                const card = $(`
          <article class="card shadow-sm">
            <div class="card-body d-flex flex-column">
              <div>
                <strong>
                  <i class="fa-solid fa-user me-1"></i>
                  ${c.username}
                </strong><br />
                <small class="text-muted">${formatDate(c.date)}</small>
              </div>

              <p class="mt-2 flex-grow-1 comment-text"></p>

              <div class="text-end mt-3 actions d-none"></div>
            </div>
          </article>
        `);

                card.find(".comment-text").text(c.text);

                if (c.isOwner) {
                    const actions = card.find(".actions").removeClass("d-none");

                    $("<button>")
                        .addClass("btn btn-sm btn-outline-primary me-2")
                        .text("Edit")
                        .on("click", () => {
                            const newText = prompt("Edit your comment:", c.text);
                            if (!newText) return;

                            $.ajax({
                                url: `/api/comments/${c.id}`,
                                method: "PUT",
                                contentType: "application/json",
                                data: JSON.stringify({ text: newText })
                            }).done(loadComments);
                        })
                        .appendTo(actions);

                    $("<button>")
                        .addClass("btn btn-sm btn-outline-danger")
                        .text("Delete")
                        .on("click", () => {
                            $.ajax({
                                url: `/api/comments/${c.id}`,
                                method: "DELETE"
                            }).done(loadComments);
                        })
                        .appendTo(actions);
                }

                $list.append(card);
            });
        });
    }

    $form.on("submit", function (e) {
        e.preventDefault();

        const text = $("#comment-message").val().trim();
        if (!text) return;

        $.ajax({
            url: "/api/comments",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ text })
        }).done(() => {
            $("#comment-message").val("");
            loadComments();
        });
    });

    $("#sort-comments").on("change", function () {
        currentOrder = this.value;
        loadComments();
    });

    loadUserAndComments();
});