
$(function () {
  const $modal = $("#galleryModal");
  const $modalImage = $("#galleryModalImage");
  const $modalTitle = $("#galleryModalLabel");

  $(".gallery-thumb").on("click", function () {
    const src = $(this).attr("src");
    const alt = $(this).attr("alt") || "";
    const title = $(this).data("title") || alt || "Image";

    $modalImage.attr("src", src);
    $modalImage.attr("alt", alt);
    $modalTitle.text(title);

    const bsModal = new bootstrap.Modal($modal[0]);
    bsModal.show();
  });
});
