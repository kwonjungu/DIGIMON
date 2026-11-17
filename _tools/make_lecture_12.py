# 1~2차시 수업 교안: python _tools/make_lecture_12.py
# → 1-2/lecture/index.html(넘겨 보는 교안) + 1-2/lecture/DIGIMON_1-2차시_수업교안.pdf
# 틀(lecture.css·lecture.js)은 에듀다움 강의교안(~/projects/edudaum/_tools)에서 가져와 그대로 쓴다.
# 뼈대: 티처스랩 디지몬 제출 지도안(1-2/9차시)
import os, html, subprocess
import qrcode, qrcode.image.svg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, '1-2', 'lecture')
EDU = os.path.expanduser('~/projects/edudaum/_tools')
PDF = 'DIGIMON_1-2차시_수업교안.pdf'
SITE = 'https://kwonjungu.github.io/DIGIMON/1-2/'
e = html.escape
FACE = 'img/mascot.webp'
AI = '생성형 AI로 만든 그림이 있어요'
WEB = '화면: DIGIMON 1~2차시 웹 활동지'


def qr(url):
    s = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=1).to_string(encoding='unicode')
    return s[s.index('<svg'):]


def go(url, label):
    return f'<div class="go"><span class="qr">{qr(url)}</span><a href="{url}" target="_blank" class="btn">{label} ↗</a></div>'


def bub(t, step=None, r=False):
    st = f' data-step="{step}"' if step else ''
    return f'<div class="bub{" r" if r else ""}"{st}><img class="face" src="{FACE}" alt=""><div class="talk"><b class="nm">디지몬</b>{t}</div></div>'


def bubs(ts, start=1):
    return ''.join(bub(t, start + i) for i, t in enumerate(ts))


def pic(src, cls=''):
    return f'<figure class="pic {cls}"><img src="{src}" alt="" loading="lazy"></figure>'


def head(tag, title):
    return (f'<span class="ktag">{e(tag)}</span>' if tag else '') + f'<h2 class="h">{title}</h2>'


def memo(t):
    return f'<div class="memo">{t}</div>' if t else ''


# ---------- 장 만들기 ----------
def cover():
    return ('<div class="cover">' + pic('../assets/hero.webp', 'bg contain') +
            '<div class="ctext"><span class="kick">5·6학년 1~2차시, 스마트 반려동물 집사</span>'
            '<h1 class="h">데이터로 만나는<br>반려동물 사회</h1><p class="lead">문제 마주보기</p></div>'
            '</div>', AI)


def path(items, ts):
    cells = ''.join(f'<li class="{"cha" if b == "" else ""}"><b>{e(a)}</b><span>{e(b)}</span></li>' for a, b in items)
    return (head('', '오늘의 길') + f'<ol class="path">{cells}</ol><div class="pathrow">{pic("../assets/act3-pets.webp", "contain")}{bubs(ts)}</div>', AI)


def scene(tag, title, img, ts, note='', src=AI):
    return (head(tag, title) + f'<div class="two wide">{pic(img, "contain")}<div class="col">{bubs(ts)}{memo(note)}</div></div>', src)


def mission(problem, ts):
    return (f'<div class="two">{pic("../assets/act1-data.webp", "contain")}<div class="mcard"><span class="stamp">오늘의 미션</span>'
            f'<p class="mq">{e(problem)}</p>{bubs(ts)}</div></div>', AI)


def open_(tag, title, img, todo, ts, link=None, note=''):
    g = go(*link) if link else ''
    return (head(tag, title) + f'<div class="two wide">{pic(img, "contain")}<div class="col"><p class="todo">{todo}</p>{g}{bubs(ts)}{memo(note)}</div></div>', AI)


def cap(tag, title, img, ts, note='', link=None, src=WEB, wide=False):
    g = go(*link) if link else ''
    from PIL import Image
    w, h = Image.open(os.path.join(OUT, img)).size
    if w / h > 1.8:   # 가로로 긴 캡처: 위에 크게, 말풍선은 아래 줄
        return (head(tag, title) + f'<div class="capt"><div class="shot"><img src="{img}" alt=""></div>'
                f'<div class="bubrow">{bubs(ts)}</div><div class="capfoot">{memo(note)}{g}</div></div>', src)
    return (head(tag, title) + f'<div class="cap{" wide" if wide else ""}"><div class="shot"><img src="{img}" alt=""></div>'
            f'<div class="col">{bubs(ts)}{memo(note)}{g}</div></div>', src)


def cap2(tag, title, a, b, la, lb, ts, src=WEB):
    return (head(tag, title) + f'<div class="cap2"><figure class="shot"><img src="{a}" alt=""><figcaption>{e(la)}</figcaption></figure>'
            f'<figure class="shot"><img src="{b}" alt=""><figcaption>{e(lb)}</figcaption></figure></div>'
            f'<div class="bubrow">{bubs(ts)}</div>', src)


def predict(tag, title, q, opts, after, ts, note=''):
    o = ''.join(f'<button class="opt">{e(x)}</button>' for x in opts)
    return (head(tag, title) + f'<div class="two wide"><div class="col"><p class="q">{q}</p><div class="opts">{o}</div>{bubs(ts)}</div>'
            f'<div class="col shotcol" data-step="{len(ts) + 1}"><div class="shot"><img src="{after}" alt=""></div>{memo(note)}</div></div>', WEB)


def flips(tag, title, cards, ts):
    c = ''.join(f'<button class="flip"><span class="fr"><b>{e(f)}</b></span><span class="bk">{b}</span></button>' for f, b in cards)
    return (head(tag, title) + f'<div class="flips">{c}</div><div class="bubrow">{bubs(ts)}</div>',
            '출처: 농림축산식품부·검역본부 「2025년 반려동물 양육현황 조사」')


def gallery(tag, title, ts):
    figs = ''.join(f'<figure><img src="gallery/익명화{i}.webp" alt="익명화{i} 그래프"><figcaption>익명화{i}</figcaption></figure>' for i in range(1, 19))
    return (head(tag, title) + f'<div class="gal">{figs}</div><div class="bubrow">{bubs(ts)}</div>',
            '예시 자료: 웹 활동지 「나도 어린이 통계청」으로 만든 학급 그래프 18장(수치는 예시)')


def brk(title, ts):
    return (f'<div class="brk">{pic("../assets/act2-trend.webp", "contain")}<div class="col"><h2 class="h">{title}</h2>{bubs(ts)}</div></div>', AI)


def wrap(tag, title, items):
    li = ''.join(f'<li data-step="{i + 1}">{x}</li>' for i, x in enumerate(items))
    return (head(tag, title) + f'<div class="two wide">{pic("../assets/hero.webp", "contain")}<ol class="wrapq">{li}</ol></div>', AI)


def done(ts, nxt):
    return (f'<div class="done">{pic("../assets/act3-pets.webp", "contain")}<div class="col"><span class="seal">미션 해결!</span>'
            f'<h2 class="h">1~2차시 미션 해결 보고</h2>{bubs(ts)}<p class="next"><b>다음</b> {nxt}</p></div></div>', AI)


T1 = 'https://trends.google.co.kr/trends/explore?geo=KR&q=%EA%B0%95%EC%95%84%EC%A7%80,%EA%B3%A0%EC%96%91%EC%9D%B4'
SLIDES = [
    ('cover', cover()),
    ('path', path([('1차시', ''), ('도입', '우리 반 손들기와 교실 토론'), ('활동1', '데이터 조사관이 되었어요'), ('활동2', '유기동물 공고 살펴보기'),
                   ('2차시', ''), ('활동2', '엔트리로 차트 만들기'), ('활동3', '여러 종류의 반려동물'), ('정리', '반려동물 문제 한 문장')],
                  ['두 차시 동안 이 길을 따라가요. 웹 활동지를 열어 두세요.'])),
    ('scene', scene('1차시 도입', '우리 반 반려동물 손들기', '../assets/act3-pets.webp',
                    ['집에서 반려동물을 키우는 친구, 손을 들어 볼까요?', '어떤 동물인지 칠판 표에 바를 정(正) 자로 세어 적어요.'],
                    '칠판 표 칸: 강아지, 고양이, 물고기, 햄스터, 그 밖의 동물, 안 키워요')),
    ('cap', cap('1차시 도입', '강아지 vs 고양이, 누가 더 인기일까?', 'shots/p1_2.webp',
                ['내 생각을 먼저 고르고, 그렇게 생각한 이유를 말해 봐요.', '우리 반 결과가 <b>우리나라 전체</b>와 같을까요?'],
                '웹 활동지 활동1 ①에 내 생각과 이유를 적어요.')),
    ('mission', mission('다양한 데이터를 활용해 반려동물 현황을 조사하여, 우리 사회의 반려동물 문제를 설명할 수 있다.',
                        ['오늘은 데이터 조사관이 되어 세 가지 데이터를 살펴봐요.'])),
    ('open', open_('1차시 활동1', '데이터 조사관이 되었어요', '../assets/act1-data.webp',
                   '구글 트렌드에서 기간은 <b>최근 5년</b>, 지역은 <b>대한민국</b>으로 정하고 \'강아지\'와 \'고양이\' 검색량을 비교해요.',
                   ['검색량은 사람들이 얼마나 궁금해했는지 보여 주는 데이터예요.'], (T1, '구글 트렌드 열기'))),
    ('cap', cap('1차시 활동1', '그래프에서 무엇이 보이나요?', 'shots/trend.webp',
                ['두 선 가운데 어느 쪽이 더 높나요?', '가장 높이 올라간 때는 언제예요? 왜 그랬을지 <b>까닭을 짐작</b>해 봐요.'],
                '위 그래프는 활동지에 담긴 자료로 전 세계 기준이에요. 트렌드 접속이 안 되면 이 그래프로 봐요.')),
    ('cap', cap('1차시 활동1', '시기와 지역에 따른 발견 사실', 'shots/p1_4.webp',
                ['시기에 따라, 지역에 따라 달라진 점을 찾아 적어요.', '<b>더 알고 싶은 질문</b>은 공책에 하나 적고 짝과 나눠요.'],
                '발견 사실은 웹 활동지 활동1의 두 칸에 적고 사진 저장으로 공유해요.')),
    ('open', open_('1차시 활동2', '한 발짝 더, 동물 데이터를 들여다봐요', '../assets/act2-trend.webp',
                   '가상 도시 <b>별빛시</b>의 유기동물 자료를 살펴보고, 연도별 수를 표로 정리해요.',
                   ['별빛시는 수업을 위해 만든 가상의 도시예요. 실제 공고는 단추를 눌러 확인해요.'], ('https://www.animal.go.kr/', '실제 공고 확인하기'))),
    ('cap', cap('1차시 활동2', '별빛시 2026년 가을 공고 살펴보기', 'shots/p2_notice.webp',
                ['동물들은 어디에서 발견되었나요? 지금은 어떻게 지내고 있나요?', '보호 중, 입양됨, 주인에게 돌아감… 동물의 입장에서 살펴봐요.'],
                '개, 고양이, 그 외 단추로 종류별 공고를 모아 볼 수 있어요.')),
    ('cap', cap('1차시 활동2', '연간 기록을 보고 표에 직접 입력해요', 'shots/p2_year.webp',
                ['별빛시 동물보호센터의 2022년부터 2025년까지 기록이에요.', '웹 활동지 ② 표에 개, 고양이, 그 외 숫자를 직접 입력해요.'],
                '빈 정리표 CSV를 내려받아 써도 돼요.')),
    ('break', brk('1차시 끝! 잠깐 쉬어요', ['다음 시간에는 정리한 표를 엔트리로 그래프로 만들어요.'])),
    ('cap', cap('2차시 활동2', '엔트리 데이터 분석으로 차트 그리기', 'shots/p2_4.webp',
                ['작품 만들기 → 데이터분석 → 테이블 불러오기 순서로 들어가요.', '차트 탭에서 <b>막대</b>나 <b>꺾은선</b>을 골라요.'],
                link=('https://playentry.org/', '엔트리 열기'))),
    ('cap', cap('2차시 활동2', '그래프에서 발견한 사실', 'shots/p2_5.webp',
                ['내가 만든 그래프에서 개, 고양이 수가 어떻게 바뀌었나요?', '발견한 사실을 한두 문장으로 적어요.'],
                '웹 활동지 활동2 「그래프에서 발견한 사실」 칸')),
    ('cap', cap('2차시 활동2', '한 번 더: 실제 전국 자료와 견주어 봐요', 'shots/p2_nat_t.webp',
                ['별빛시와 전국은 무엇이 같고, 무엇이 다른가요?', '검색 관심은 높은데 왜 매년 버려질까요? 유기동물의 입장에서 이야기 나눠 봐요.'],
                '웹 활동지 활동2 「한 번 더」를 펼쳐서 봐요.')),
    ('open', open_('2차시 활동3', '여러 종류의 반려동물을 살펴봐요', '../assets/act3-pets.webp',
                   '2025년 반려동물 양육현황 조사(국가승인통계)로 우리나라 가정이 실제로 키우는 동물을 살펴봐요.',
                   ['이 조사는 누구에게 무엇을 물어서 모은 데이터일까요? 제목을 먼저 읽어 봐요.'])),
    ('predict', predict('2차시 활동3', '먼저 예측해요', '우리나라 반려가구가<br>가장 많이 키우는 동물은?', ['개', '고양이', '물고기', '햄스터'],
                        'shots/species.webp', ['내 예측을 고른 뒤 그래프를 확인해요.'])),
    ('cap2', cap2('2차시 활동3', '두 데이터의 1등이 같나요?', 'shots/trend.webp', 'shots/species.webp', '검색 관심도', '실제 양육 비율',
                  ['두 그래프는 각각 <b>무엇을 잰 데이터</b>일까요?', '왜 결과가 다를지 짝과 이유를 찾아봐요.'])),
    ('flip', flips('2차시 활동3', '숫자 카드 뒤집기', [('우리나라 가구 중 반려동물을 키우는 비율은?', '<b>29.2%</b>'),
                                                    ('어류를 키우는 집은 평균 몇 마리?', '<b>13.1마리</b>'),
                                                    ('반려동물과 함께한 평균 시간은?', '<b>6년 5개월</b>')],
                   ['카드를 누르기 전에 먼저 어림해 봐요.'])),
    ('cap', cap('2차시 활동3', '우리 곁의 다양해진 반려동물', 'shots/p3_4.webp',
                ['관심 가는 동물을 모두 골라요.', '동물보호법에 따라 등록하는 반려동물도 있어요.'],
                '등록 대상 6종: 개, 고양이, 토끼, 페럿, 기니피그, 햄스터')),
    ('cap2', cap2('2차시 활동3', '나도 어린이 통계청', 'shots/p3_5_table.webp', 'shots/p3_5_graph.webp', '① 표 만들기', '③ 완성된 그래프',
                  ['조사 주제를 고르고 손을 든 친구 수를 +로 세요. 그래프 종류도 바꿔 봐요.', '다 만들면 <b>그래프 사진으로 저장</b>을 눌러요.'])),
    ('gallery', gallery('2차시 더 해 보기', '우리 반 그래프 전시회', ['친구 그래프에서 가장 눈에 띄는 사실 하나를 찾아 말해 봐요.'])),
    ('cap', cap('2차시 활동3', '내가 가장 좋아하는 동물', 'shots/p3_6.webp',
                ['다양한 반려동물 가운데 내가 가장 좋아하는 동물을 골라요.', '그 동물에 대해 가장 궁금한 점을 적어요.'],
                '③에 동물과 고른 까닭을, 「다음 시간으로 이어가기」에 궁금한 점을 적어요.')),
    ('wrap', wrap('2차시 정리', '오늘 찾은 것 정리', ['세 가지 데이터가 알려 준 것을 한 줄씩 말해요.',
                                                  '우리 사회의 반려동물 문제를 한 문장으로 정리해요.',
                                                  '책임감 있는 반려 문화를 위해 우리가 할 수 있는 일은?'])),
    ('done', done(['데이터로 우리 사회의 반려동물 문제를 찾아냈어요!'],
                  '3~4차시: 오늘 고른 동물을 생성형 AI와 프롬프트로 \'나만의 반려동물\'로 만들어요.')),
]

EXTRA = '''
.cap{display:flex;gap:26px;flex:1;min-height:0}
.cap .shot,.cap2 .shot,.shotcol .shot{background:#fff;border:3px solid var(--line);border-radius:20px;box-shadow:0 6px 18px #0002;display:flex;align-items:center;justify-content:center;padding:10px;min-height:0;overflow:hidden}
.cap .shot{flex:1.45}.cap.wide .shot{flex:1.9}
.cap .shot img,.cap2 .shot img,.shotcol .shot img{max-width:100%;max-height:100%;object-fit:contain;display:block}
.cap .col{flex:1;display:flex;flex-direction:column;gap:14px;justify-content:center;min-width:0}
.cap2{display:flex;gap:20px;flex:1;min-height:0;margin-bottom:12px}
.cap2 .shot{flex:1;flex-direction:column;gap:6px;margin:0}
.cap2 .shot img{flex:1;min-height:0;width:100%}.cap2 figcaption{flex:none;font-family:'Jua';font-size:24px;line-height:1.2;color:var(--grass-d)}
.shotcol{justify-content:center}.shotcol .shot{max-height:470px}
.gal{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:1fr;gap:10px;flex:1;min-height:0;margin-bottom:10px}
.gal figure{position:relative;background:#fff;border:2px solid var(--line);border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.gal img{max-width:100%;max-height:100%;object-fit:contain}
.gal figcaption{position:absolute;left:6px;top:6px;font-family:'Jua';font-size:14px;background:var(--ink);color:#fff;border-radius:8px;padding:1px 8px}
.flip .fr{padding:18px}.flip .fr b{font-size:28px;line-height:1.35}.flip .bk b{font-size:56px;font-family:'Jua'}
.wrapq{list-style:none;counter-reset:w;display:flex;flex-direction:column;gap:16px;justify-content:center;flex:1}
.wrapq li{counter-increment:w;background:#fff;border-radius:18px;padding:16px 20px 16px 70px;font-size:27px;position:relative;box-shadow:0 3px 10px #0001}
.wrapq li::before{content:counter(w);position:absolute;left:16px;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;background:var(--grass);color:#fff;font-family:'Jua';font-size:24px;display:flex;align-items:center;justify-content:center}
.go .qr svg{width:110px;height:110px}
.t-flip .bubrow{display:flex!important;margin-top:24px}.t-flip .flips{flex:none}
.capt{display:flex;flex-direction:column;gap:12px;flex:1;min-height:0}
.capt .shot{background:#fff;border:3px solid var(--line);border-radius:20px;box-shadow:0 6px 18px #0002;padding:8px;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
.capt .shot img{max-width:100%;max-height:100%;object-fit:contain}
.capt .bubrow{display:flex;gap:16px}.capt .bubrow .bub{flex:1}
.capfoot{display:flex;gap:16px;align-items:center}.capfoot .memo{flex:1}.capfoot .go .qr svg{width:80px;height:80px}
'''


def build():
    css = open(os.path.join(EDU, 'lecture.css'), encoding='utf-8').read().replace('../../assets/fonts/', 'fonts/') + EXTRA
    js = open(os.path.join(EDU, 'lecture.js'), encoding='utf-8').read()
    N = len(SLIDES); parts = []
    for i, (t, (body, src)) in enumerate(SLIDES):
        aim = f'<span class="aisl">{e(src)}</span>' if src else ''
        parts.append(f'<section class="s t-{t}" data-i="{i}">{body}<div class="grass"></div>{aim}'
                     f'<span class="pn">1~2차시 · {i + 1} / {N}</span></section>')
    doc = ('<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
           '<title>1~2차시 수업 교안 · 데이터로 만나는 반려동물 사회 · DIGIMON</title>'
           f'<link rel="icon" href="{FACE}"><style>{css}</style></head><body><main class="deck">{"".join(parts)}</main>'
           '<nav class="ctl"><a href="../">← 활동지</a><button id="prev" title="앞 장">←</button><span id="pg"></span><button id="nextb" title="다음">→</button>'
           f'<button id="fs" title="전체 화면 (F)">⛶ 전체 화면</button><a href="{PDF}" download>PDF</a></nav><script>{js}</script></body></html>')
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(doc)
    subprocess.run(['node', os.path.join(EDU, 'lecture_pdf.cjs'), os.path.join(OUT, 'index.html'), os.path.join(OUT, PDF)], check=True)
    print(N, '장 →', OUT)


if __name__ == '__main__':
    build()
