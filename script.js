// all-html

// 初回アクセス時の同意バナー制御
document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("consentBanner");
    const btnAgree = document.getElementById("btnBannerAgree");
    const btnClose = document.getElementById("btnBannerClose");

    // すでに同意済み（agreed）かチェック
    const isAgreed = localStorage.getItem("siteConsentAgreed");

    // 同意していない場合のみバナーを表示
    if (!isAgreed && banner) {
        banner.style.display = "flex";
    }

    // 「同意する」をクリックした時
    if (btnAgree) {
        btnAgree.addEventListener("click", () => {
            // ローカルストレージにフラグを保存（次回から出なくなる）
            localStorage.setItem("siteConsentAgreed", "true");
            if (banner) banner.style.display = "none";
        });
    }

    // 「閉じる」をクリックした時
    if (btnClose) {
        btnClose.addEventListener("click", () => {
            // 保存せずに画面上から消すだけ（リロードや次回アクセス時にはまた出る）
            if (banner) banner.style.display = "none";
        });
    }
});

// PCアクセス判定, 注意ポップアップ表示制御
document.addEventListener("DOMContentLoaded", () => {
    const pcModal = document.getElementById("pcNoticeModal");
    const btnClose = document.getElementById("btnPcNoticeClose");

    // 画面横幅が768px以上（一般的にPCサイズ）かどうか判定
    const isPcSize = window.innerWidth >= 768;

    // PCサイズで開かれた場合のみ表示
    if (isPcSize && pcModal) {
        pcModal.style.display = "flex";
    }

    // 「このまま閲覧する」を押したら閉じる
    if (btnClose) {
        btnClose.addEventListener("click", () => {
            if (pcModal) pcModal.style.display = "none";
        });
    }
});

// ハンバーガーメニュー
const bottommanu_manu_bottom_close = document.getElementById("bottommanu_manu_bottom_close");
const bottommanu_button_A = document.getElementById("bottommanu_button_A");
const bottommanu_button_B = document.getElementById("bottommanu_button_B");
const bottommanu_manu = document.getElementById("bottommanu_manu");

if (bottommanu_button_A) {
    bottommanu_button_A.addEventListener('click', () => {
        bottommanu_manu.style.display = "flex";
    });
}

if (bottommanu_button_B) {
    bottommanu_button_B.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });
}

if (bottommanu_manu_bottom_close) {
    bottommanu_manu_bottom_close.addEventListener('click', () => {
        bottommanu_manu.style.display = "none";
    });
}


// chusen-html

let hasAnnounced = false;

// ==========================================
// 2. 初期化 ＆ 候補者・選択肢フォーム動的生成
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    generateCandidateInputs();

    const electionTypeSelect = document.getElementById("electionType");
    if (electionTypeSelect) {
        electionTypeSelect.addEventListener("change", generateCandidateInputs);
    }
});

function generateCandidateInputs() {
    const typeSelect = document.getElementById("electionType");
    const countSelect = document.getElementById("candCount");
    const singleContainer = document.querySelector(".chusen_setting_body_form_koho_single");
    const referendumContainer = document.querySelector(".chusen_setting_body_form_koho_referendum");

    if (!typeSelect || !countSelect || !singleContainer || !referendumContainer) return;

    const type = typeSelect.value;
    const count = parseInt(countSelect.value, 10);

    // --- 住民投票の場合 ---
    if (type === "referendum") {
        singleContainer.style.display = "none";
        singleContainer.innerHTML = "";

        referendumContainer.style.display = "block";
        referendumContainer.innerHTML = "<h3>選択肢の設定</h3>";

        for (let i = 0; i < count; i++) {
            const itemHTML = `
                <div class="setting_form_item">
                    <p class="setting_form_item_title">選択肢 ${i + 1}</p>
                    <input type="text" id="candName_${i}" class="form-control" placeholder="例：賛成">
                </div>
            `;
            referendumContainer.insertAdjacentHTML("beforeend", itemHTML);
        }
    }
    // --- 小選挙区の場合 ---
    else {
        referendumContainer.style.display = "none";
        referendumContainer.innerHTML = "";

        singleContainer.style.display = "block";
        singleContainer.innerHTML = "<h3>候補者の設定</h3>";

        for (let i = 0; i < count; i++) {
            const itemHTML = `
                <div class="setting_form_card">
                    <p class="setting_form_card_title">候補者 ${i + 1}</p>
                    <div class="setting_form_field">
                        <p>氏名</p>
                        <input type="text" id="candName_${i}" class="form-control" placeholder="例：候補 太郎">
                    </div>
                    <div class="setting_form_field">
                        <p>政党名</p>
                        <input type="text" id="candParty_${i}" class="form-control" placeholder="例：無所属">
                    </div>
                    <div class="setting_form_field">
                        <p>政党カラー</p>
                        <input type="color" id="candColor_${i}" class="form-control-color" value="#1e3ea4">
                    </div>
                    <div class="setting_form_field">
                        <p>重要情報（新、当選回数、年齢など ※カンマ区切り）</p>
                        <input type="text" id="candInfo_${i}" class="form-control" placeholder="例：当選:1回目, 65歳">
                    </div>
                    <div class="setting_form_field">
                        <p>経歴</p>
                        <input type="text" id="candCareer_${i}" class="form-control" placeholder="例：元経営者">
                    </div>
                </div>
            `;
            singleContainer.insertAdjacentHTML("beforeend", itemHTML);
        }
    }
}


// ==========================================
// 3. 独自モーダル（ポップアップ）制御
// ==========================================
function showModal(title, message, type, onConfirm = null) {
    const modal = document.getElementById("customModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalButtons = document.getElementById("modalButtons");

    if (!modal || !modalTitle || !modalMessage || !modalButtons) return;

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalMessage.innerText = message;
    modalButtons.innerHTML = "";

    if (type === "error") {
        modalTitle.style.color = "#f50909";
        modalTitle.style.borderColor = "#f50909";

        const closeBtn = document.createElement("button");
        closeBtn.className = "btn_modal_error_close";
        closeBtn.textContent = "閉じて再入力";
        closeBtn.onclick = () => modal.style.display = "none";
        modalButtons.appendChild(closeBtn);
    } else if (type === "confirm") {
        modalTitle.style.color = "#162c71";
        modalTitle.style.borderColor = "#1e3ea4";

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn_modal_cancel";
        cancelBtn.textContent = "修正する";
        cancelBtn.onclick = () => modal.style.display = "none";

        const okBtn = document.createElement("button");
        okBtn.className = "btn_modal_ok";
        okBtn.textContent = "この設定で開始";
        okBtn.onclick = () => {
            modal.style.display = "none";
            if (onConfirm) onConfirm();
        };

        modalButtons.appendChild(cancelBtn);
        modalButtons.appendChild(okBtn);
    }

    modal.style.display = "flex";
}


// ==========================================
// 4. 「抽選を開始する」クリック時の処理
// ==========================================
function startElection() {
    const areaNameInput = document.getElementById("areaName");
    const votersInput = document.getElementById("voters");
    const turnoutInput = document.getElementById("turnout");
    const typeSelect = document.getElementById("electionType");
    const countSelect = document.getElementById("candCount");

    const areaName = areaNameInput ? areaNameInput.value.trim() : "";
    const voters = votersInput ? parseInt(votersInput.value, 10) : 0;
    const turnout = turnoutInput ? parseFloat(turnoutInput.value) : 0;
    const electionType = typeSelect ? typeSelect.value : "single";
    const count = countSelect ? parseInt(countSelect.value, 10) : 2;

    const errors = [];

    if (!areaName) {
        errors.push("・地区名（選挙区名）を入力してください。");
    }
    if (isNaN(voters) || voters <= 0) {
        errors.push("・有権者数は 1 以上の数字を入力してください。");
    }
    if (isNaN(turnout) || turnout < 1 || turnout > 100) {
        errors.push("・投票率は 1% 〜 100% の範囲で入力してください。");
    }

    for (let i = 0; i < count; i++) {
        const nameInput = document.getElementById(`candName_${i}`);
        if (nameInput && !nameInput.value.trim()) {
            const label = electionType === "referendum" ? `選択肢 ${i + 1}` : `候補者 ${i + 1} の氏名`;
            errors.push(`・${label}を入力してください。`);
        }
    }

    if (errors.length > 0) {
        showModal("入力エラー", errors.join("\n"), "error");
        return;
    }

    const typeLabel = electionType === "referendum" ? "住民投票" : "小選挙区";
    const totalVotes = Math.floor(voters * (turnout / 100));

    let warningNote = "";
    if (voters >= 300000) {
        warningNote = "\n\n⚠️ 【ご注意】\n有権者数が多いため、開票演出が完了するまでに少し時間がかかる場合があります。";
    }

    const confirmMsg =
        `以下の設定で抽選（開票）を開始しますか？\n\n` +
        `【地区名】${areaName}\n` +
        `【種別】${typeLabel}\n` +
        `【有権者数】${voters.toLocaleString()} 人\n` +
        `【投票率】${turnout} %\n` +
        `【想定投票数】約 ${totalVotes.toLocaleString()} 票` +
        warningNote;

    showModal("設定内容の確認", confirmMsg, "confirm", () => {
        const resultSection = document.querySelector(".chusen_result");
        if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }

        runElectionSimulation();
    });
}

// ==========================================
// 5. 得票数・無効票の計算ロジック（ランダム勝者 & 惜敗率80〜90%対応）
// ==========================================
function calculateElectionResults(voters, turnout, count, mode) {
    const totalVotes = Math.floor(voters * (turnout / 100));
    const invalidVotes = 0;
    let validVotes = totalVotes - invalidVotes;

    const candidateVotes = new Array(count).fill(0);

    // 1. 勝者を完全ランダムで選ぶ
    const indices = Array.from({ length: count }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const winnerIndex = indices[0];
    const secondIndex = count > 1 ? indices[1] : -1;

    // 2. モードごとの惜敗率設定
    let secondRatio;
    if (mode === "close") {
        secondRatio = 0.80 + Math.random() * 0.10; // 惜敗率 80〜90%
    } else {
        secondRatio = 0.30 + Math.random() * 0.20; // 大差 30〜50%
    }

    const tempRatios = new Array(count).fill(0);
    tempRatios[winnerIndex] = 1.0;
    if (secondIndex !== -1) {
        tempRatios[secondIndex] = secondRatio;
    }

    for (let i = 2; i < count; i++) {
        const otherIndex = indices[i];
        tempRatios[otherIndex] = secondRatio * (0.30 + Math.random() * 0.30);
    }

    const totalRatioSum = tempRatios.reduce((sum, r) => sum + r, 0);

    let allocatedVotes = 0;
    for (let i = 0; i < count; i++) {
        const votes = Math.floor(validVotes * (tempRatios[i] / totalRatioSum));
        candidateVotes[i] = votes;
        allocatedVotes += votes;
    }

    let remainingVotes = validVotes - allocatedVotes;
    while (remainingVotes > 0) {
        const rIdx = Math.floor(Math.random() * count);
        candidateVotes[rIdx]++;
        remainingVotes--;
    }

    return {
        totalVotes,
        invalidVotes,
        validVotes,
        candidateVotes
    };
}

// ==========================================
// 6. 開票アニメーション（★ 元のカウントアップ処理のまま完全復元）
// ==========================================
async function runElectionSimulation() {
    const startBtn = document.querySelector(".chusen_setting_body_form_start")
        || document.getElementById("chusen_setting_body_form_start")
        || document.querySelector("button");

    if (startBtn) {
        startBtn.disabled = true;
        startBtn.style.opacity = "0.5";
        startBtn.style.cursor = "not-allowed";
    }

    hasAnnounced = false;

    const targetContainer = document.getElementById('chusen_result_burner');
    if (targetContainer) targetContainer.innerHTML = "";

    const areaName = document.getElementById("areaName").value.trim();
    const voters = parseInt(document.getElementById("voters").value, 10);
    const turnout = parseFloat(document.getElementById("turnout").value);
    const electionType = document.getElementById("electionType").value;
    const count = parseInt(document.getElementById("candCount").value, 10);

    const modeSelect = document.getElementById("raceMode");
    const mode = modeSelect ? modeSelect.value : "close";

    const speedSelect = document.getElementById("electionSpeed");
    const speedValue = speedSelect ? speedSelect.value : "normal";

    let intervalTime = 200;
    if (speedValue === "fast") {
        intervalTime = 100;
    } else if (speedValue === "slow") {
        intervalTime = 400;
    }

    const resultData = calculateElectionResults(voters, turnout, count, mode);
    const totalVotes = resultData.totalVotes;
    const finalVotes = resultData.candidateVotes;

    let currentVotes = new Array(count).fill(0);
    let currentTotalProcessed = 0;

    // --- 元のカウントアップループ ---
    while (currentTotalProcessed < totalVotes) {
        let minRemaining = Infinity;
        for (let i = 0; i < count; i++) {
            const rem = finalVotes[i] - currentVotes[i];
            if (rem > 0 && rem < minRemaining) {
                minRemaining = rem;
            }
        }

        if (minRemaining === Infinity) break;

        let chunkSize = voters < 50000 ? 100 : 1000;

        if (minRemaining < chunkSize) {
            if (minRemaining >= 500) {
                chunkSize = 500;
            } else if (minRemaining >= 100) {
                chunkSize = 100;
            } else if (minRemaining >= 10) {
                chunkSize = 10;
            } else {
                chunkSize = minRemaining;
            }
        }

        let addedInThisStep = 0;
        for (let i = 0; i < count; i++) {
            const rem = finalVotes[i] - currentVotes[i];
            const add = Math.min(chunkSize, rem);
            currentVotes[i] += add;
            addedInThisStep += add;
        }

        currentTotalProcessed += addedInThisStep;

        if (addedInThisStep === 0) {
            currentVotes = [...finalVotes];
            currentTotalProcessed = totalVotes;
            break;
        }

        const isFinished = (currentTotalProcessed >= totalVotes) ||
            (currentVotes.every((v, idx) => v === finalVotes[idx]));

        const processedRate = isFinished
            ? "100.0"
            : ((currentTotalProcessed / totalVotes) * 100).toFixed(1);

        updateResultDOM({
            areaName,
            voters,
            turnout,
            electionType,
            count,
            mode,
            currentVotes,
            finalVotes,
            totalVotes,
            currentTotalProcessed: isFinished ? totalVotes : currentTotalProcessed,
            processedRate,
            isFinished
        });

        if (isFinished) break;

        let currentInterval = intervalTime;
        if (chunkSize <= 100 && chunkSize > 10) currentInterval = Math.max(30, intervalTime / 2);
        if (chunkSize <= 10) currentInterval = Math.max(10, intervalTime / 4);

        await new Promise(resolve => setTimeout(resolve, currentInterval));
    }

    // 100%描画
    updateResultDOM({
        areaName,
        voters,
        turnout,
        electionType,
        count,
        mode,
        currentVotes: finalVotes,
        finalVotes,
        totalVotes,
        currentTotalProcessed: totalVotes,
        processedRate: "100.0",
        isFinished: true
    });

    // 5秒後にボタン復活
    setTimeout(() => {
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.style.opacity = "1";
            startBtn.style.cursor = "pointer";
        }
    }, 5000);
}

// ==========================================
// 7. HTML描画 ＆ 当確判定処理
// ==========================================
function updateResultDOM(data) {
    const {
        areaName, voters, turnout, electionType, count, mode,
        currentVotes, finalVotes, totalVotes, currentTotalProcessed,
        processedRate, isFinished
    } = data;

    const safeTotalProcessed = currentTotalProcessed > 0 ? currentTotalProcessed : 1;

    // 現在の得票数順にソート
    const sortedCandidates = currentVotes
        .map((votes, originalIndex) => ({ votes, originalIndex }))
        .sort((a, b) => b.votes - a.votes);

    // ★ 最終結果における1位の候補者を特定（バッジ・テロップのアテブレ防止）
    const finalSortedCandidates = finalVotes
        .map((votes, originalIndex) => ({ votes, originalIndex }))
        .sort((a, b) => b.votes - a.votes);

    const finalWinnerIndex = finalSortedCandidates[0].originalIndex;

    const statusText = isFinished ? "開票終了" : `開票率 ${processedRate}%`;
    const headerHTML = `
        <div class="chusen_result_body_header">
            <div class="chusen_result_body_header_top">
                <div class="chusen_result_body_header_top_district">${areaName}</div>
            </div>
            <div class="chusen_result_body_header_bottom">
                <div class="chusen_result_body_header_bottom_labelA">有権者数<b>${voters.toLocaleString()}</b>人</div>
                <div class="chusen_result_body_header_bottom_labelA">投票率<b>${turnout}</b>%</div>
                <div class="chusen_result_body_header_bottom_labelB">${statusText}</div>
            </div>
        </div>
    `;

    let bodyListHTML = "";

    for (let rank = 0; rank < count; rank++) {
        const item = sortedCandidates[rank];
        const i = item.originalIndex;
        const votes = item.votes;

        const shareRate = currentTotalProcessed > 0
            ? ((votes / safeTotalProcessed) * 100).toFixed(1)
            : "0.0";

        const graphWidth = currentTotalProcessed > 0 ? shareRate : 0;

        let badgeText = "";
        // 最終的な勝者にのみ「確」や「当」を付与
        if (i === finalWinnerIndex) {
            if (isFinished) {
                badgeText = electionType === "referendum" ? "多数" : "当";
            } else if (mode !== "close" && parseFloat(processedRate) >= 20) {
                badgeText = electionType === "referendum" ? "確実" : "確";
            } else if (mode === "close" && parseFloat(processedRate) >= 90) {
                badgeText = electionType === "referendum" ? "確実" : "確";
            }
        }

        const badgeClass = badgeText ? "tousen" : "";

        if (electionType === "referendum") {
            const nameInput = document.getElementById(`candName_${i}`);
            const label = nameInput ? nameInput.value.trim() : `選択肢 ${i + 1}`;

            bodyListHTML += `
                <div class="chusen_result_body_body_referendum">
                    <div class="chusen_result_body_body_referendum_top">
                        <div class="chusen_result_body_body_referendum_top_result ${badgeClass}">${badgeText}</div>
                        <div class="chusen_result_body_body_referendum_top_label">${label}</div>
                    </div>
                    <div class="chusen_result_body_body_referendum_bottom">
                        <div class="chusen_result_body_body_referendum_bottom_graph">
                            <div class="chusen_result_body_body_referendum_bottom_graph_get" style="width: ${graphWidth}%;"></div>
                        </div>
                        <div class="chusen_result_body_body_referendum_bottom_vote">
                            <div class="chusen_result_body_body_referendum_bottom_vote_num">${votes.toLocaleString()}</div>
                            <div class="chusen_result_body_body_referendum_bottom_vote_rate">（${shareRate}%）</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const nameInput = document.getElementById(`candName_${i}`);
            const partyInput = document.getElementById(`candParty_${i}`);
            const colorInput = document.getElementById(`candColor_${i}`);
            const infoInput = document.getElementById(`candInfo_${i}`);
            const careerInput = document.getElementById(`candCareer_${i}`);

            const name = nameInput ? nameInput.value.trim() : "";
            const party = partyInput ? partyInput.value.trim() : "";
            const partyColor = colorInput ? colorInput.value : "#1e3ea4";
            const infoRaw = infoInput ? infoInput.value.trim() : "";
            const career = careerInput ? careerInput.value.trim() : "";

            const formattedInfo = infoRaw ? infoRaw.replace(/,/g, "<span></span>") : "";
            let careerHTML = formattedInfo && career ? `${formattedInfo}<br>${career}` : (formattedInfo || career);

            bodyListHTML += `
                <div class="chusen_result_body_body_koho">
                    <div class="chusen_result_body_body_koho_top">
                        <div class="chusen_result_body_body_koho_top_left">
                            <div class="chusen_result_body_body_koho_top_left_result ${badgeClass}">${badgeText}</div>
                        </div>
                        <div class="chusen_result_body_body_koho_top_body">
                            <img src="kouho_sample.png" alt="" class="chusen_result_body_body_koho_top_body_image">
                            <div class="chusen_result_body_body_koho_top_body_info">
                                <div class="chusen_result_body_body_koho_top_body_info_top">
                                    <div class="chusen_result_body_body_koho_top_body_info_top_party" style="color: ${partyColor};">${party}</div>
                                    <div class="chusen_result_body_body_koho_top_body_info_top_name">
                                        <div class="chusen_result_body_body_koho_top_body_info_top_name_bigname">${name}</div>
                                    </div>
                                </div>
                                <div class="chusen_result_body_body_koho_top_body_info_career">${careerHTML}</div>
                            </div>
                        </div>
                    </div>
                    <div class="chusen_result_body_body_koho_bottom">
                        <div class="chusen_result_body_body_koho_bottom_graph">
                            <div class="chusen_result_body_body_koho_bottom_graph_get" style="width: ${graphWidth}%;"></div>
                        </div>
                        <div class="chusen_result_body_body_koho_bottom_vote">
                            <div class="chusen_result_body_body_koho_bottom_vote_num">${votes.toLocaleString()}</div>
                            <div class="chusen_result_body_body_koho_bottom_vote_rate">（${shareRate}%）</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    const resultContainer = document.getElementById("chusen_result_body");
    if (resultContainer) {
        resultContainer.innerHTML = headerHTML + `<div class="chusen_result_body_body">${bodyListHTML}</div>`;
    }

    const currentRate = parseFloat(processedRate);
    const isSkewedMode = (mode === "skewed");
    const isCloseMode = (mode === "close");

    const shouldAnnounce =
        (isSkewedMode && currentRate >= 20) ||
        (isCloseMode && currentRate >= 90);

    if (!hasAnnounced && shouldAnnounce) {
        const nameInput = document.getElementById(`candName_${finalWinnerIndex}`);
        const partyInput = document.getElementById(`candParty_${finalWinnerIndex}`);

        const winnerNameOrLabel = nameInput ? nameInput.value.trim() : "";
        const winnerParty = partyInput ? partyInput.value.trim() : "";

        const isReferendum = (electionType === "referendum");
        const badgeText = isReferendum ? "確実" : "当確";

        if (winnerNameOrLabel) {
            triggerTokakuNews(
                areaName,
                electionType,
                winnerNameOrLabel,
                winnerParty,
                winnerNameOrLabel,
                badgeText
            );

            hasAnnounced = true;
        }
    }
}


/**
 * 当確 / 住民投票テロップを表示する関数
 */
function triggerTokakuNews(areaName, type, name, party, label, badgeText) {
    const targetContainer = document.getElementById('chusen_result_burner');
    if (!targetContainer) return;

    targetContainer.innerHTML = "";

    const isReferendum = (type === "referendum");
    const displayBadge = badgeText || (isReferendum ? "確実" : "当確");
    const mainText = isReferendum ? (label || name || "") : (name || "");

    const bannerHTML = `
    <div id="tokakuBanner" class="tokaku-banner ${isReferendum ? 'referendum-mode' : ''}">
        <div class="tokaku-badge">${displayBadge}</div>
        <div class="tokaku-content">
            <span id="tokakuArea" class="tokaku-area">${areaName || ""}</span>
            <span id="tokakuName" class="tokaku-name">${mainText}</span>
            ${(!isReferendum && party) ? `<span class="tokaku-party">${party}</span>` : ""}
        </div>
    </div>
    `;

    targetContainer.innerHTML = bannerHTML;

    requestAnimationFrame(() => {
        const banner = document.getElementById("tokakuBanner");
        if (!banner) return;

        setTimeout(() => {
            banner.classList.add("show");

            setTimeout(() => {
                banner.classList.remove("show");
            }, 5000);
        }, 50);
    });
}

