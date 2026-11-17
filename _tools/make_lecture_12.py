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


CREW = [('img/mascot.webp', '멍이'), ('img/cat.webp', '냥이'), ('img/rabbit.webp', '토토'),
        ('img/hamster.webp', '햄찌'), ('img/bird.webp', '짹짹'), ('img/fish.webp', '뻐끔')]
TURN = [0]   # 말풍선마다 캐릭터를 차례로 바꾼다(한 장 안에서도 서로 다르게)


def bub(t, step=None, r=False):
    st = f' data-step="{step}"' if step else ''
    face, nm = CREW[TURN[0] % len(CREW)]; TURN[0] += 1
    return f'<div class="bub{" r" if r else ""}"{st}><img class="face" src="{face}" alt=""><div class="talk"><b class="nm">{nm}</b>{t}</div></div>'


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
            '<div class="ctext"><span class="kick">5학년과 6학년 1~2차시, 스마트 반려동물 집사</span>'
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


def think(tag, title, q, ts, note=''):
    return (head(tag, title) + f'<div class="think">{pic("../assets/act1-data.webp", "contain")}<p class="q">{q}</p></div>'
            f'<div class="bubrow three">{bubs(ts)}</div>{memo(note)}', AI)


def cap(tag, title, img, ts, note='', link=None, src=WEB, wide=False):
    g = go(*link) if link else ''
    from PIL import Image
    w, h = Image.open(os.path.join(OUT, img)).size
    if w / h > 1.8:   # 가로로 긴 캡처: 위에 크게, 말풍선은 아래 줄
        return (head(tag, title) + f'<div class="capt"><div class="shot"><img src="{img}" alt=""></div>'
                f'<div class="bubrow">{bubs(ts)}</div><div class="capfoot">{memo(note)}{g}</div></div>', src)
    return (head(tag, title) + f'<div class="cap{" wide" if wide else ""}"><div class="shot"><img src="{img}" alt=""></div>'
            f'<div class="col">{bubs(ts)}{memo(note)}{g}</div></div>', src)


def cap2(tag, title, a, b, la, lb, ts, src=WEB, link=None):
    g = go(*link) if link else ''
    return (head(tag, title) + f'<div class="cap2"><figure class="shot"><img src="{a}" alt=""><figcaption>{e(la)}</figcaption></figure>'
            + (f'<figure class="shot">{b}<figcaption>{e(lb)}</figcaption></figure></div>' if b.startswith('<') else f'<figure class="shot"><img src="{b}" alt=""><figcaption>{e(lb)}</figcaption></figure></div>') +
            f'<div class="bubrow">{bubs(ts)}{g}</div>', src)


def bars(title, rows, unit, src):   # 교실 뒤에서도 읽히는 큰 글씨 가로 막대(그림이 아닌 HTML)
    mx = max(v for _, v in rows)
    li = ''.join(f'<li><b>{e(n)}</b><span class="bar"><i style="width:{max(v / mx * 100, 0.8):.1f}%"></i></span><em>{v:g}{unit}</em></li>' for n, v in rows)
    t = f'<p class="ht">{e(title)}</p>' if title else ''
    sr = f'<p class="hs">{e(src)}</p>' if src else ''
    return f'<div class="hbars">{t}<ul>{li}</ul>{sr}</div>'


KOSIS = bars('우리나라 반려가구가 키우는 동물(2025)', [('개', 80.5), ('고양이', 14.4), ('어류', 4.1), ('햄스터, 토끼 등', 1.0), ('앵무새 등 새', 0.7), ('도마뱀, 거북 등', 0.5)], '%',
             '양육 가구 867곳, 여러 개 고르기')
KOSIS_S = bars('', [('개', 80.5), ('고양이', 14.4), ('어류', 4.1), ('햄스터, 토끼 등', 1.0), ('앵무새 등 새', 0.7), ('도마뱀, 거북 등', 0.5)], '%', '')


def predict(tag, title, q, opts, after, ts, note=''):
    o = ''.join(f'<button class="opt">{e(x)}</button>' for x in opts)
    return (head(tag, title) + f'<div class="two wide"><div class="col"><p class="q">{q}</p><div class="opts">{o}</div>{bubs(ts)}</div>'
            f'<div class="col shotcol" data-step="{len(ts) + 1}">{after if after.startswith("<") else f"<div class=shot><img src={after} alt=></div>"}{memo(note)}</div></div>',
            '출처: 농림축산식품부와 검역본부 「2025년 반려동물 양육현황 조사」')


def flips(tag, title, cards, ts):
    c = ''.join(f'<button class="flip"><span class="fr"><b>{e(f)}</b></span><span class="bk">{b}</span></button>' for f, b in cards)
    return (head(tag, title) + f'<div class="flips">{c}</div><div class="bubrow">{bubs(ts)}</div>',
            '출처: 농림축산식품부와 검역본부 「2025년 반려동물 양육현황 조사」')


def gallery(tag, title, ts):
    figs = ''.join(f'<button class="gfig" type="button"><img src="gallery/익명화{i}.webp" alt="우리 반 그래프 {i}"></button>' for i in range(1, 19))
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
                   ['검색량은 무엇을 알려 주는 숫자일까요? 먼저 생각해 봐요.'], (T1, '구글 트렌드 열기'))),
    ('cap', cap('1차시 활동1', '그래프에서 무엇이 보이나요?', 'shots/trend.webp',
                ['두 선 가운데 어느 쪽이 더 높나요?', '가장 높이 올라간 때는 언제예요? 왜 그랬을지 <b>까닭을 짐작</b>해 봐요.'],
                '왼쪽 그래프는 활동지에 담긴 자료로 전 세계 기준이에요. 트렌드 접속이 안 되면 이 그래프로 봐요.')),
    ('think', think('1차시 활동1 생각해 보기', '강아지와 고양이, 공정한 비교일까?', '검색어 하나로<br>두 동물의 인기를 견주어도 될까요?',
                    ['강아지를 찾을 때 <b>개</b>나 <b>반려견</b>이라고 검색하는 사람도 있지 않을까요?', '고양이를 부르는 다른 말도 있을까요? 낱말에 따라 결과가 달라질까요?',
                     '<b>강아지</b>는 어린 개를 뜻하기도 해요. 다 큰 개를 찾는 사람은 어떤 낱말을 쓸까요?'],
                    '떠오른 낱말을 구글 트렌드에 넣어 직접 비교해 봐요.')),
    ('cap', cap('1차시 활동1', '시기와 지역에 따른 발견 사실', 'shots/p1_4.webp',
                ['시기에 따라, 지역에 따라 달라진 점을 찾아 적어요.', '<b>더 알고 싶은 질문</b>은 공책에 하나 적고 짝과 나눠요.'],
                '발견 사실은 웹 활동지 활동1의 두 칸에 적고 사진 저장으로 공유해요.')),
    ('open', open_('1차시 활동2', '한 발짝 더, 동물 데이터를 들여다봐요', '../assets/act2-trend.webp',
                   '가상 도시 <b>별빛시</b>의 유기동물 자료를 살펴보고, 연도별 수를 표로 정리해요.',
                   ['별빛시는 수업을 위해 만든 가상의 도시예요. 실제 공고는 단추를 눌러 확인해요.'], ('https://www.animal.go.kr/front/awtis/public/publicList.do?menuNo=1000000055', '실제 공고 확인하기'))),
    ('cap', cap('1차시 활동2', '별빛시 2026년 가을 공고 살펴보기', 'shots/p2_notice.webp',
                ['동물들은 어디에서 발견되었나요? 지금은 어떻게 지내고 있나요?', '보호 중, 입양됨, 주인에게 돌아감… 동물의 입장에서 살펴봐요.'],
                '개, 고양이, 그 외 단추로 종류별 공고를 모아 볼 수 있어요.')),
    ('cap', cap('1차시 활동2', '연간 기록을 보고 표에 직접 입력해요', 'shots/p2_year.webp',
                ['별빛시 동물보호센터의 2022년부터 2025년까지 기록이에요.', '웹 활동지 ② 표에 개, 고양이, 그 외 숫자를 직접 입력해요.'],
                '빈 정리표 CSV를 내려받아 써도 돼요.')),
    ('break', brk('1차시 끝! 잠깐 쉬어요', ['다음 시간에는 정리한 표를 엔트리로 그래프로 만들어요.'])),
    ('cap', cap('2차시 활동2', '엔트리에 들어가요', 'shots/en1_menu.webp',
                ['엔트리 누리집 위쪽 <b>만들기</b>에 마우스를 올리고 <b>작품 만들기</b>를 눌러요.', '작품을 저장하려면 먼저 로그인해요.'],
                link=('https://playentry.org/', '엔트리 열기'), src='화면: 엔트리(playentry.org)')),
    ('cap', cap('2차시 활동2', '데이터분석에서 테이블 불러오기', 'shots/en2_table.webp',
                ['왼쪽 블록 꾸러미에서 <b>데이터분석</b>을 눌러요.', '위에 나타난 <b>테이블 불러오기</b>를 눌러요.'],
                src='화면: 엔트리(playentry.org) 작품 만들기')),
    ('cap', cap('2차시 활동2', '새 표를 만들어요', 'shots/en34.webp',
                ['창이 열리면 왼쪽 위 <b>테이블 추가하기</b>를 눌러요.', '<b>새로 만들기</b> 탭을 고르고 오른쪽 <b>테이블 새로 만들기</b>를 눌러요.'],
                src='화면: 엔트리(playentry.org) 작품 만들기')),
    ('cap', cap('2차시 활동2', '표에 숫자를 입력해요', 'shots/en5_type.webp',
                ['첫 줄에는 연도, 개, 고양이, 그 외를 써요.', '아래 줄에는 활동지 ② 표에 정리한 숫자를 그대로 옮겨 적어요.'],
                '칸을 두 번 누르면 글자를 쓸 수 있어요. 맨 위 칸에서 표 이름도 바꿔요.', src='화면: 엔트리(playentry.org) 작품 만들기')),
    ('cap2', cap2('2차시 활동2', '차트를 골라요', 'shots/en6_bar.webp', 'shots/en7_axis.webp', '차트 탭에서 더하기, 막대', '가로축은 연도, 계열은 모두',
                  ['<b>차트</b> 탭을 누르고 <b>+</b> 단추를 눌러 <b>막대</b>를 골라요.', '가로축은 <b>연도</b>, 계열은 <b>모두</b>에 표시해요. 선 그래프로도 바꿔 봐요.'],
                  src='화면: 엔트리(playentry.org) 작품 만들기')),
    ('cap', cap('2차시 활동2', '차트가 완성되었어요', 'shots/en8_done.webp',
                ['다 되면 창 오른쪽 위의 <b>적용하기</b>를 눌러요.', '막대와 선 가운데 어느 쪽이 변화를 더 잘 보여 주나요?'],
                src='화면: 엔트리(playentry.org) 작품 만들기, 숫자는 별빛시 가상 자료', wide=True)),
    ('cap', cap('2차시 활동2', '그래프에서 발견한 사실', 'shots/p2_5.webp',
                ['내가 만든 그래프에서 개, 고양이 수가 어떻게 바뀌었나요?', '발견한 사실을 한두 문장으로 적어요.'],
                '웹 활동지 활동2 「그래프에서 발견한 사실」 칸')),
    ('cap', cap('2차시 활동2', '한 번 더: 실제 전국 자료와 견주어 봐요', 'shots/p2_nat_t.webp',
                ['별빛시와 전국은 무엇이 같고, 무엇이 다른가요?', '검색 관심은 높은데 왜 매년 버려질까요? 유기동물의 입장에서 이야기 나눠 봐요.'],
                '웹 활동지 활동2 「한 번 더」를 펼쳐서 봐요.')),
    ('open', open_('2차시 활동3', '여러 종류의 반려동물을 살펴봐요', '../assets/act3-pets.webp',
                   '2025년 반려동물 양육현황 조사(국가승인통계)로 우리나라 가정이 실제로 키우는 동물을 살펴봐요.',
                   ['이 조사는 누구에게 무엇을 물어서 모은 데이터일까요? 제목을 먼저 읽어 봐요.'])),
    ('predict', predict('2차시 활동3', '먼저 예측해요', '우리나라 반려가구가<br>가장 많이 키우는 동물은?', ['개', '고양이', '어류(물고기)', '햄스터'],
                        KOSIS, ['내 예측을 고른 뒤 그래프를 확인해요.'])),
    ('cap2', cap2('2차시 활동3', '두 데이터의 1등이 같나요?', 'shots/trend.webp', KOSIS_S, '그래프 가', '그래프 나',
                  ['두 그래프는 각각 <b>무엇을 잰 데이터</b>일까요?', '왜 결과가 다를지 짝과 이유를 찾아봐요.'])),
    ('flip', flips('2차시 활동3', '숫자 카드 뒤집기', [('우리나라 가구 중 반려동물을 키우는 비율은?', '<b>29.2%</b>'),
                                                    ('어류를 키우는 집은 평균 몇 마리?', '<b>13.1마리</b>'),
                                                    ('반려동물과 함께한 평균 시간은?', '<b>6년 5개월</b>')],
                   ['카드를 누르기 전에 먼저 어림해 봐요.'])),
    ('cap', cap('2차시 활동3', '우리 곁의 다양해진 반려동물', 'shots/p3_4.webp',
                ['관심 가는 동물을 모두 골라요.', '동물보호법은 어떤 동물을 반려동물로 정해 두었을까요?'],
                '활동지 ② 아래 ※ 글에서 답을 찾아봐요.')),
    ('cap2', cap2('2차시 더 해 보기', '나도 어린이 통계청', 'shots/p3_5_table.webp', 'shots/p3_5_graph.webp', '① 표 만들기', '③ 완성된 그래프',
                  ['조사 주제를 고르고 손을 든 친구 수를 +로 세요. 그래프 종류도 바꿔 봐요.', '다 만들면 <b>그래프 사진으로 저장</b>을 눌러요.'])),
    ('gallery', gallery('2차시 더 해 보기', '우리 반 그래프 전시회(예시)', ['예시로 만든 그래프예요. 누르면 크게 볼 수 있어요. 가장 눈에 띄는 사실 하나를 찾아 말해 봐요.'])),
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
.gal .gfig{position:relative;cursor:zoom-in;padding:0;background:#fff;border:2px solid var(--line);border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.gal img{max-width:100%;max-height:100%;object-fit:contain}
.glight{position:fixed;inset:0;background:#000c;z-index:99;display:flex;align-items:center;justify-content:center;gap:2vw;cursor:zoom-out}
.glight img{max-width:80vw;max-height:88vh;background:#fff;border-radius:16px;box-shadow:0 10px 40px #0008}
.glight .gn{font-family:'Jua';font-size:6vh;color:#fff;background:#fff3;border:0;border-radius:50%;width:9vh;height:9vh;cursor:pointer}
.glight .gc{position:absolute;bottom:3vh;color:#fff;font-family:'Jua';font-size:3vh}
.flip .fr{padding:18px}.flip .fr b{font-size:28px;line-height:1.35}.flip .bk b{font-size:56px;font-family:'Jua'}
.wrapq{list-style:none;counter-reset:w;display:flex;flex-direction:column;gap:16px;justify-content:center;flex:1}
.wrapq li{counter-increment:w;background:#fff;border-radius:18px;padding:16px 20px 16px 70px;font-size:27px;position:relative;box-shadow:0 3px 10px #0001}
.wrapq li::before{content:counter(w);position:absolute;left:16px;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;background:var(--grass);color:#fff;font-family:'Jua';font-size:24px;display:flex;align-items:center;justify-content:center}
.go .qr svg{width:110px;height:110px}
.t-flip .bubrow{display:flex!important;margin-top:24px}.t-flip .flips{flex:none}
.think{display:flex;align-items:center;gap:40px;flex:1;min-height:0}.think .pic{width:300px;height:220px;flex:none}.think .q{font-size:40px;line-height:1.4}
.bubrow.three{display:flex;gap:14px;margin:8px 0 12px}.bubrow.three .bub{flex:1}.bubrow.three .talk{font-size:22px}
.hbars{background:#fff;border:3px solid var(--line);border-radius:20px;box-shadow:0 6px 18px #0002;padding:18px 24px;width:100%}
.hbars .ht{font-family:'Jua';font-size:26px;margin-bottom:10px}.hbars ul{list-style:none;display:flex;flex-direction:column;gap:10px}
.hbars li{display:grid;grid-template-columns:170px 1fr 92px;align-items:center;gap:10px;font-size:23px}.hbars li b{font-weight:400;text-align:right}
.hbars .bar{height:30px;background:#f1eee7;border-radius:8px;overflow:hidden}.hbars .bar i{display:block;height:100%;background:var(--grass);border-radius:8px}
.hbars em{font-style:normal;font-family:'Jua';font-size:24px}.hbars .hs{font-size:16px;color:var(--sub);margin-top:8px}
.cap2 .shot .hbars{border:0;box-shadow:none;padding:6px 10px;flex:1;display:flex;align-items:center}.cap2 .shot .hbars ul{width:100%}.cap2 .shot .hbars li{grid-template-columns:150px 1fr 80px;font-size:20px}.cap2 .shot .hbars .bar{height:24px}
.path{display:grid!important;grid-template-columns:repeat(4,1fr);gap:10px}.path li.cha{display:flex;align-items:center;justify-content:center}.path li.cha b{font-size:32px}.path li.cha span{display:none}
.capt{display:flex;flex-direction:column;gap:12px;flex:1;min-height:0}
.capt .shot{background:#fff;border:3px solid var(--line);border-radius:20px;box-shadow:0 6px 18px #0002;padding:8px;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
.capt .shot img{max-width:100%;max-height:100%;object-fit:contain}
.capt .bubrow{display:flex;gap:16px}.capt .bubrow .bub{flex:1}
.capfoot{display:flex;gap:16px;align-items:center}.capfoot .memo{flex:1}.capfoot .go .qr svg{width:80px;height:80px}
'''


LIGHT = '''(function(){
  var figs=[].slice.call(document.querySelectorAll('.gfig')), box=null, k=0;
  function show(i){ k=(i+figs.length)%figs.length; box.querySelector('img').src=figs[k].querySelector('img').src; box.querySelector('.gc').textContent=(k+1)+' / '+figs.length; }
  function close(){ if(box){ box.remove(); box=null; } }
  figs.forEach(function(f,i){ f.addEventListener('click',function(ev){ ev.stopPropagation(); close();
    box=document.createElement('div'); box.className='glight';
    box.innerHTML='<button class="gn" type="button" aria-label="앞 그래프">‹</button><img alt=""><button class="gn" type="button" aria-label="다음 그래프">›</button><span class="gc"></span>';
    var b=box.querySelectorAll('.gn'); b[0].onclick=function(e){e.stopPropagation();show(k-1);}; b[1].onclick=function(e){e.stopPropagation();show(k+1);};
    box.onclick=function(e){e.stopPropagation();close();}; document.body.appendChild(box); show(i); }); });
  document.addEventListener('keydown',function(ev){ if(!box) return;
    if(ev.key==='ArrowRight'){show(k+1);} else if(ev.key==='ArrowLeft'){show(k-1);} else if(ev.key==='Escape'||ev.key===' '){close();} else return;
    ev.preventDefault(); ev.stopImmediatePropagation(); }, true);
})();'''


def build():
    css = open(os.path.join(EDU, 'lecture.css'), encoding='utf-8').read().replace('../../assets/fonts/', 'fonts/') + EXTRA
    js = open(os.path.join(EDU, 'lecture.js'), encoding='utf-8').read()
    N = len(SLIDES); parts = []
    for i, (t, (body, src)) in enumerate(SLIDES):
        aim = f'<span class="aisl">{e(src)}</span>' if src else ''
        parts.append(f'<section class="s t-{t}" data-i="{i}">{body}<div class="grass"></div>{aim}'
                     f'<span class="pn">1~2차시 {i + 1} / {N}</span></section>')
    doc = ('<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
           '<title>1~2차시 수업 교안 · 데이터로 만나는 반려동물 사회 · DIGIMON</title>'
           f'<link rel="icon" href="{FACE}"><style>{css}</style></head><body><main class="deck">{"".join(parts)}</main>'
           '<nav class="ctl"><a href="../">← 활동지</a><button id="prev" title="앞 장">←</button><span id="pg"></span><button id="nextb" title="다음">→</button>'
           f'<button id="fs" title="전체 화면 (F)">⛶ 전체 화면</button><a href="{PDF}" download>PDF</a></nav><script>{js}</script><script>{LIGHT}</script></body></html>')
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(doc)
    subprocess.run(['node', os.path.join(EDU, 'lecture_pdf.cjs'), os.path.join(OUT, 'index.html'), os.path.join(OUT, PDF)], check=True)
    print(N, '장 →', OUT)


if __name__ == '__main__':
    build()
