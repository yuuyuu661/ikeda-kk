document.addEventListener('DOMContentLoaded', () => {
  const eventOptions = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'];

  // 各 select に選択肢を挿入
  for (let row = 1; row <= 7; row++) {
    for (let col = 1; col <= 3; col++) {
      const select = document.querySelector(`select[name="event${row}-${col}"]`);
      if (select) {
        select.innerHTML = '<option value="">選択</option>' +
          eventOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('');
      }
    }
  }

  // 各行の第1〜第3希望で重複選択を無効化
  for (let i = 1; i <= 7; i++) {
    const selects = [
      document.querySelector(`select[name="event${i}-1"]`),
      document.querySelector(`select[name="event${i}-2"]`),
      document.querySelector(`select[name="event${i}-3"]`)
    ];

    selects.forEach(sel => {
      sel.addEventListener('change', () => {
        const selectedValues = selects.map(s => s.value);

        selects.forEach(s => {
          Array.from(s.options).forEach(opt => {
            if (opt.value === '') {
              opt.disabled = false;
              return;
            }

            const isSelectedElsewhere = selectedValues.includes(opt.value) && s.value !== opt.value;
            opt.disabled = isSelectedElsewhere;
          });
        });
      });
    });
  }

  // フォーム送信処理
  document.getElementById("customForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!confirm("この内容で送信しますか？")) return;

    const form = e.target;
    const formURL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSf1fnvxl1wKoaGoeeFu_tyOYGeTqwK7kJ5k2y67vo9eASRPzg/formResponse";

    const headerCompany = form.querySelector(`[name="entry.404333895"]`)?.value.trim();
    const headerName = form.querySelector(`[name="entry.900152718"]`)?.value.trim();

    if (!headerCompany) {
      alert("記入者の会社名を入力してください。");
      return;
    }

    if (!headerName) {
      alert("記入者の氏名を入力してください。");
      return;
    }

    // ✅ 1回だけチェック
    const isAttending = form.querySelector('input[name="attendance"]:checked')?.value === "参加";
    if (isAttending) {
      const firstName = form.querySelector('[name="name1"]')?.value.trim();
      if (!firstName) {
        alert("参加を選んだ場合は、1行目の氏名を入力してください。");
        return;
      }
    }

    // 記入者情報送信
    const headerData = new FormData();
    headerData.append("entry.404333895", headerCompany);
    headerData.append("entry.900152718", headerName);

    try {
      await fetch(formURL, { method: "POST", mode: "no-cors", body: headerData });
    } catch (err) {
      console.error("記入者情報の送信に失敗しました", err);
    }

    for (let i = 1; i <= 7; i++) {
      const name = form.querySelector(`[name="name${i}"]`)?.value.trim();
      if (!name) continue;

      const data = new FormData();
      data.append("entry.1362334110", headerCompany);
      data.append("entry.129665814", form.querySelector(`[name="kana${i}"]`)?.value || "");
      data.append("entry.1402396482", name);
      data.append("entry.715732439", form.querySelector(`[name="gender${i}"]`)?.value || "");
      data.append("entry.776014874", form.querySelector(`[name="ageGroup${i}"]`)?.value || "");
      data.append("entry.1070622365", form.querySelector(`[name="event${i}-1"]`)?.value || "");
      data.append("entry.259301235", form.querySelector(`[name="event${i}-2"]`)?.value || "");
      data.append("entry.1330943837", form.querySelector(`[name="event${i}-3"]`)?.value || "");
      data.append("entry.1486323525", form.querySelector(`[name="contact${i}"]`)?.value || "");

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
