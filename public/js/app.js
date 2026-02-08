import { getTodayCharacter } from "./character.js";
import { getMsToNextDay } from "./time.js";

const SCHEDULE_BUFFER_MS = 50;

boot();

function boot() {
  // 초기 렌더
  render(getTodayCharacter());

  // 다음 날이 되면 렌더링 갱신
  setTimeout(boot, getMsToNextDay() + SCHEDULE_BUFFER_MS);
}

function render(character) {
  document.getElementById("todayName").textContent = character.fullName;

  const todayCharIcon = document.getElementById("todayCharIcon");
  todayCharIcon.src = character.icon;
  todayCharIcon.alt = `${character.fullName} 아이콘`;

  const todayExhibit = document.getElementById("todayExhibit");
  todayExhibit.src = character.exhibit;
  todayExhibit.alt = `${character.fullName} 전시품`;
}
