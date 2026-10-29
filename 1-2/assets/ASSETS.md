# DIGIMON 그림 에셋 — 1~2차시: 데이터로 만나는 반려동물 사회

생성 도구: 내장 image_gen. 기존 hero-main PNG는 재생성·수정 없이 재사용했다. 신규 그림은 모든 생성 호출에 3-4/assets/_src/mascot.png를 캐릭터·화풍 참고 이미지로 제공했다. 음식 단독 아이콘에서는 같은 참고 그림의 화풍만 적용했다.

출력: 투명 RGBA WebP, quality=82, method=6. KB는 1024바이트 기준이다. 모든 파일은 150,000바이트 미만이다. 3:2의 640px 버전은 정수 픽셀 반올림으로 640×427px이다. 원본 비율을 유지해 알파 경계를 정리하고 투명 여백 안에 배치했으며, PNG 원본은 _src/에 보관했다. 배경 제거용 외부 모델은 사용하지 않았다.

검수: 최종 WebP를 하나씩 view_image로 확인했다. 글자·숫자·로고, 캐릭터 불일치, 배경 번짐을 확인했으며 요청한 체크·금지·경고·방향·물음표 기호만 사용했다. 위험 음식은 접시 또는 사진 카드에만 있으며 먹는 장면은 없다.

| 파일 | 픽셀 | KB | 설명 | 권장 alt |
|---|---:|---:|---|---|
| hero.webp | 960×540 | 103.13 | 조사 수첩을 든 마스코트와 여러 반려동물 | 조사 수첩을 든 강아지와 고양이, 토끼, 햄스터, 물고기, 새 |
| act1-data.webp | 640×427 | 47.19 | 탐정 모자와 돋보기로 막대그래프를 조사 | 탐정 모자를 쓰고 돋보기로 막대그래프를 보는 강아지 |
| act2-trend.webp | 640×427 | 38.96 | 꺾은선그래프를 걸어 올라가는 마스코트 | 상승하는 꺾은선그래프를 따라 걸어가는 강아지 |
| act3-pets.webp | 640×427 | 57.74 | 마스코트를 포함한 다양한 반려동물 단체 그림 | 강아지와 고양이, 토끼, 햄스터, 물고기, 새가 나란히 모인 모습 |

## 실제 생성 프롬프트

각 신규 그림에 쓴 전체 프롬프트는 아래 공통 프롬프트 뒤에 해당 파일의 Scene 구문을 이어 붙인 것이다. 참조 이미지: 3-4/assets/_src/mascot.png. transparent_background=true.

### 공통 프롬프트

```text
Use case: illustration-story. Create a single polished educational website illustration, on a genuinely transparent background with clean alpha edges, no background rectangle, no ground wash or haze. Reference image 1 is the ORIGINAL MASCOT and exact style reference: preserve this original baby puppy identity, cream fluffy fur, peach floppy ears, three-tuft forelock, rounded paws, curled fluffy tail, dark brown round eyes and tiny nose, peach cheeks. Match warm children's picture-book illustration, clean flat pastel colors, subtle watercolor paper texture INSIDE objects only, brown outlines, teal and coral accents. No copyrighted character resemblance. No text, no letters, no numbers, no logos, no watermark. Blank books/screens/charts have no labels, axes have no ticks or numerals. Simple child hands and paws. All objects fully inside canvas, modest transparent margin, readable at small size. Only symbols explicitly requested may appear.
```

### hero.webp

원본: _src/hero.png

```text
Scene: Wide 16:9. Puppy centered holding a small blank survey notebook, surrounded in a friendly group by a pastel cat, rabbit, hamster, orange fish visibly inside a clear round water bowl, and a small bird. All six animals recognizable, puppy is largest. No text in notebook.
```

### act1-data.webp

원본: _src/act1-data.png

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Clean cutout sticker illustration with hard clean alpha, NO GLOW, NO SHADOW, NO colored halo, NO haze, NO backdrop.  Puppy wears a soft tan detective cap, holds a teal magnifying glass toward a standalone pastel bar chart. Four bars of varying heights, no numbers labels or ticks. Curious detective pose.
```

재생성 1회: 배경에 넓은 색 번짐이 있어 재생성。최초 미채택 PNG는 _src/의 -rejected- 파일로 보관했다.

최초 프롬프트의 Scene 구문:

```text
Scene: Landscape 3:2. Puppy wears a soft tan detective cap, holds a teal magnifying glass toward a standalone pastel bar chart. Four bars of varying heights, no numbers labels or ticks. Curious detective pose.
```

### act2-trend.webp

원본: _src/act2-trend.png

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Clean cutout sticker illustration with hard clean alpha, NO GLOW, NO SHADOW, NO colored halo, NO haze, NO backdrop.  Puppy walks upward balancing on a thick rising teal line graph with round data dots and a simple unlabeled axis. One continuous graph rises in a few gentle zigzags from lower left to upper right. No numbers or ticks.
```

재생성 1회: 배경에 넓은 색 번짐이 있어 재생성。최초 미채택 PNG는 _src/의 -rejected- 파일로 보관했다.

최초 프롬프트의 Scene 구문:

```text
Scene: Landscape 3:2. Puppy walks upward balancing on a thick rising teal line graph with round data dots and a simple unlabeled axis. One continuous graph rises in a few gentle zigzags from lower left to upper right. No numbers or ticks.
```

### act3-pets.webp

원본: _src/act3-pets.png

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Clean cutout sticker illustration with hard clean alpha, NO GLOW, NO SHADOW, NO colored halo, NO haze, NO backdrop.  Friendly lineup of original cream puppy mascot, cat, rabbit, hamster, fish inside clear round water bowl, and bird perched beside them. All animals sit in a neat gently curved row, puppy near center, no clothes.
```

재생성 1회: 배경에 넓은 색 번짐이 있어 재생성。최초 미채택 PNG는 _src/의 -rejected- 파일로 보관했다.

최초 프롬프트의 Scene 구문:

```text
Scene: Landscape 3:2. Friendly lineup of original cream puppy mascot, cat, rabbit, hamster, fish inside clear round water bowl, and bird perched beside them. All animals sit in a neat gently curved row, puppy near center, no clothes.
```
