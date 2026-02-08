import { getDayIndex } from "./time.js";

const CHARACTERS = [
  {
    id: "Reimu",
    name: "레이무",
    icon: "assets/characters/ReimuIcon.png",
    exhibits: {
      A: "assets/exhibits/ReimuA.png",
      B: "assets/exhibits/ReimuB.png",
    },
  },
  {
    id: "Marisa",
    name: "마리사",
    icon: "assets/characters/MarisaIcon.png",
    exhibits: {
      A: "assets/exhibits/MarisaA.png",
      B: "assets/exhibits/MarisaB.png",
    },
  },
  {
    id: "Sakuya",
    name: "사쿠야",
    icon: "assets/characters/SakuyaIcon.png",
    exhibits: {
      A: "assets/exhibits/SakuyaA.png",
      B: "assets/exhibits/SakuyaB.png",
    },
  },
  {
    id: "Cirno",
    name: "치르노",
    icon: "assets/characters/CirnoIcon.png",
    exhibits: {
      A: "assets/exhibits/CirnoA.png",
      B: "assets/exhibits/CirnoB.png",
    },
  },
  {
    id: "Koishi",
    name: "코이시",
    icon: "assets/characters/KoishiIcon.png",
    exhibits: {
      A: "assets/exhibits/KoishiA.png",
      B: "assets/exhibits/KoishiB.png",
    },
  },
];

const BAG_SIZE = CHARACTERS.length * 2;

function mulberry32(seed) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, seed) {
  const rng = mulberry32(seed);
  const array = items.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBagItem(char, variant) {
  return {
    characterId: char.id,
    characterName: char.name,
    icon: char.icon,
    variant,
    exhibit: char.exhibits[variant],
    fullName: `${char.name}${variant}`,
  };
}

function swapFirstWithRandomIndex(items, seed) {
  const rng = mulberry32(seed + 500);

  // 마지막 인덱스는 제외
  // 마지막 인덱스를 포함하면 이후 가방이 이전 가방에 의존하게 되어 재귀적으로 모든 가방을 탐색해야 한다.
  const swapRange = CHARACTERS.length - 2; // -2는 마지막 인덱스를 제외하기 위함
  const swapIndex = 1 + Math.floor(rng() * swapRange);
  [items[0], items[swapIndex]] = [items[swapIndex], items[0]];
}

export function generateBag(bagIndex) {
  const seed = 1000 + bagIndex * 37;
  const prevSeed = 1000 + (bagIndex - 1) * 37;

  const prevShuffled2 = shuffle(CHARACTERS, prevSeed + 100); // 이전 가방과의 연속 검사용
  const shuffledChars1 = shuffle(CHARACTERS, seed);
  const shuffledChars2 = shuffle(CHARACTERS, seed + 100);

  // 이전 가방 끝과 현재 가방 시작 연속 검사
  if (prevShuffled2[CHARACTERS.length - 1].id === shuffledChars1[0].id) {
    swapFirstWithRandomIndex(shuffledChars1, seed);
  }

  // 현재 가방 중간 연속 검사
  if (shuffledChars1[CHARACTERS.length - 1].id === shuffledChars2[0].id) {
    swapFirstWithRandomIndex(shuffledChars2, seed + 1);
  }

  // 앞쪽 variant 무작위 할당
  const rng = mulberry32(seed + 999);
  const bagItems1 = shuffledChars1.map((char) => {
    const variant = rng() > 0.5 ? "A" : "B";
    return createBagItem(char, variant);
  });

  // 앞쪽과 반대 variant 할당
  const bagItems2 = shuffledChars2.map((char) => {
    const frontItem = bagItems1.find((item) => item.characterId === char.id);
    const variant = frontItem.variant === "A" ? "B" : "A";
    return createBagItem(char, variant);
  });

  return [...bagItems1, ...bagItems2]; // 조립 후 반환
}

export function getTodayCharacter() {
  const dayIndex = getDayIndex();
  const bagIndex = Math.floor(dayIndex / BAG_SIZE);
  const posInBag = dayIndex % BAG_SIZE;
  return generateBag(bagIndex)[posInBag];
}
