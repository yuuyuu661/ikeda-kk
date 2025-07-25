document.addEventListener('DOMContentLoaded', () => {
  const eventOptions = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'];

  for (let row = 1; row <= 7; row++) {
    for (let col = 1; col <= 3; col++) {
      const select = document.querySelector(`select[name="event${row}-${col}"]`);
      if (select) {
        select.innerHTML = '<option value="">選択</option>' +
          eventOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('');
      }
    }
  }

  // 重複選択の無効化処理（完全版）
for (let i = 1; i <= 7; i++) {
  const selects = [
    document.querySelector(`select[name="event${i}-1"]`),
    document.querySelector(`select[name="event${i}-2"]`),
    document.querySelector(`select[name="event${i}-3"]`)
  ];

  // 全セレクトにイベントを設定
  selects.forEach(sel => {
    sel.addEventListener('change', () => {
      const selectedValues = selects.map(s => s.value);

      selects.forEach(s => {
        Array.from(s.options).forEach(opt => {
          if (opt.value === '') {
            opt.disabled = false; // 「選択」は常に有効
            return;
          }

          // すでに他のセレクトで選ばれていたら無効化
          const isSelectedElsewhere = selectedValues.includes(opt.value) && s.value !== opt.value;
          opt.disabled = isSelectedElsewhere;
        });
      });
    });
  });
}
  document.getElementById("customForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!confirm("この内容で送信しますか？")) return;

    const form = e.target;
    const formURL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSf1fnvxl1wKoaGoeeFu_tyOYGeTqwK7kJ5k2y67vo9eASRPzg/formResponse";

 const headerData = new FormData();
  headerData.append("entry.404333895", form.querySelector(`[name="entry.404333895"]`)?.value || ""); // 記入者 会社名
  headerData.append("entry.900152718", form.querySelector(`[name="entry.900152718"]`)?.value || ""); // 記入者 氏名
  try {
    await fetch(formURL, { method: "POST", mode: "no-cors", body: headerData });
  } catch (err) {
    console.error("記入者情報の送信に失敗しました", err);
  }


    for (let i = 1; i <= 7; i++) {
      const name = form.querySelector(`[name="name${i}"]`)?.value.trim();
      if (!name) continue;

      const data = new FormData();
      data.append("entry.1362334110", form[`company${i}`]?.value || ""); // 会社名
      data.append("entry.129665814", form[`kana${i}`]?.value || "");     // ふりがな
      data.append("entry.1402396482", form[`name${i}`]?.value || "");    // お名前
      data.append("entry.715732439", form[`gender${i}`]?.value || "");   // 男女
      data.append("entry.776014874", form[`ageGroup${i}`]?.value || ""); // 年代
      data.append("entry.1070622365", form[`event${i}-1`]?.value || ""); // 第1希望
      data.append("entry.259301235", form[`event${i}-2`]?.value || "");  // 第2希望
      data.append("entry.1330943837", form[`event${i}-3`]?.value || ""); // 第3希望
      data.append("entry.1486323525", form[`contact${i}`]?.value || ""); // ご連絡先

      try {
        await fetch(formURL, { method: "POST", mode: "no-cors", body: data });
      } catch (err) {
        console.error(`行${i} の送信に失敗しました`, err);
      }
    }

    alert("送信が完了しました！");
    form.reset();
  });
});
