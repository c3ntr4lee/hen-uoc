// Dữ liệu mẫu nạp lần đầu — lấy từ Google Sheet "Wedding checklist - wishlist".
// Sau khi mở web, mọi thay đổi được lưu trên trình duyệt (localStorage).

const SEED_TIMELINE = {
  "12 tháng": [
    ["Thông báo dự định đám cưới cho 2 gia đình", 1],
    ["Xác định vibe đám cưới mong muốn", 1],
    ["Nhờ bố mẹ xem ngày cưới", 0],
    ["Lập danh sách khách mời dự kiến", 1],
    ["Chọn ngày và địa điểm tổ chức", 1],
    ["Liên hệ và book wedding planner (nếu cần)", 0],
    ["Tìm kiếm các dịch vụ, chi phí", 0],
    ["Chăm sóc da, tóc", 1],
  ],
  "9 – 11 tháng": [
    ["Khảo sát: chụp hình, quay phim, hoa cưới, sự kiện cưới, nhà hàng", 0],
    ["Lên kế hoạch cưới chi tiết và phân công", 0],
    ["Đặt may vest cưới, váy cưới thiết kế theo yêu cầu", 0],
    ["Lên danh sách khách mời tham dự", 1],
    ["Tìm trang phục cưới và phụ kiện", 1],
    ["Tổ chức lễ dạm ngỏ, lễ ăn hỏi", 0],
    ["Chọn dịch vụ hoa, decor, mua nhẫn", 0],
  ],
  "6 – 8 tháng": [
    ["Lên kịch bản cưới", 0],
    ["Chốt chuyên viên trang điểm", 0],
    ["Design thiệp cưới: giấy và video online", 0],
    ["Chốt đơn vị decor nhà trai, nhà gái, rạp, background chụp ảnh — cọc lần 1", 0],
    ["Chụp pre-wedding", 0],
    ["Mua trang sức, nhẫn cưới", 0],
    ["Book người điều phối (coordinator), MC", 0],
  ],
  "4 – 5 tháng": [
    ["Đăng kí học tiền hôn nhân", 0],
    ["Làm giấy đăng kí kết hôn", 0],
    ["In thiệp cưới", 0],
    ["Chốt các nghi lễ trong lễ, kịch bản tiệc", 0],
    ["Chốt trang phục chú rể", 0],
    ["Đặt xe cho tiệc cưới", 0],
    ["Book thợ makeup và làm tóc", 0],
    ["Sắp xếp chỗ nghỉ cho khách ở xa", 0],
  ],
  "3 tháng": [
    ["Đặt hoa cưới cầm tay", 0],
    ["Hoàn tất danh sách khách mời", 0],
    ["Mời người đàn, hát trong tiệc", 0],
    ["Đặt cọc nhà hàng lần 2, chọn menu tiệc", 0],
    ["Thử trang phục cưới", 0],
    ["Chốt và sắp xếp cho honeymoon", 0],
    ["Ghi tên khách mời vào thiệp offline và online", 0],
    ["Chốt trang trí lễ nhà thờ / lễ hằng thuận", 0],
    ["Hoàn tất kịch bản chương trình", 0],
    ["Chốt layout makeup phù hợp cô dâu", 0],
    ["Mua phụ kiện: giày, thắt lưng, bộ rót cát…", 0],
    ["Chốt đội bưng quả", 0],
  ],
  "1 – 2 tháng": [
    ["Làm tóc và trang điểm test", 0],
    ["Rửa ảnh chân dung cưới và album", 0],
    ["Hoàn tất chi tiết lễ nhà thờ / lễ hằng thuận", 0],
    ["Check kịch bản MC tiệc cưới", 0],
    ["Thảo luận kịch bản phóng sự cưới", 0],
    ["Sắp xếp sơ đồ và số bàn cho khách mời", 0],
    ["Spa cuối tuần cùng mẹ", 0],
    ["Hoàn chỉnh plan honeymoon", 0],
    ["Thử lại lần cuối áo cưới, vest cưới", 0],
    ["Lấy giấy đăng kí kết hôn", 0],
    ["Check chi phí lần 2 để dự trù sớm", 0],
  ],
  "2 tuần": [
    ["Lấy trang phục cho cô dâu, chú rể, ba mẹ, phù dâu, phù rể, bưng quả", 0],
    ["Báo chính xác số khách cho quản lý tiệc", 0],
    ["Đặt thiệp, viết vows, quà cho đối phương", 0],
    ["Đi gửi thiệp mời cho khách", 0],
    ["Nhắc lịch các bên: makeup, decor, mâm quả, trang phục, MC, band, xe cưới", 0],
    ["Cô dâu chăm sóc bản thân: spa, nail, salon", 0],
  ],
  "3 – 5 ngày": [
    ["Xếp vali đồ mang về nhà chồng", 0],
    ["Chuẩn bị bánh trái cho bàn gia tiên", 0],
    ["Phân công, nhắc nhiệm vụ cho người thân và bạn thân", 0],
    ["Trang trí nhà 2 bên", 0],
    ["Trang trí phòng tân hôn", 0],
    ["Nhắc lại dịch vụ: xe, makeup, chụp hình, MC, điều phối", 0],
    ["Làm nail", 0],
    ["Đi ngủ sớm và ngủ ngon", 0],
  ],
  "Ngày cưới": [
    ["Makeup, làm tóc, thay layout", 0],
    ["Chia sẻ cảm nhận với chồng / vợ", 0],
    ["Động viên ba mẹ, bày tỏ lòng cảm ơn", 0],
    ["Thật hạnh phúc với lựa chọn của mình", 0],
    ["Check hình và gửi cho khách mời sau lễ", 0],
  ],
};

// [việc, người phụ trách, thời gian chuẩn bị, tình trạng]
const SEED_CATEGORIES = {
  "Thông báo gia đình": [
    ["Chúng con đã sẵn sàng tiến đến hôn nhân", "Chúng mình", "Trước 3–5 tháng", "Hoàn tất"],
    ["Nhờ ba mẹ đi xem ngày cưới", "Gia đình", "Trước 3–5 tháng", "Đang cân nhắc"],
    ["Sắp xếp lịch gặp mặt 2 bên", "Chúng mình", "Trước 3–5 tháng", "Đang cân nhắc"],
  ],
  "Thăm nhà": [
    ["Nhà trai thăm nhà gái", "Chúng mình", "Trước 3–5 tháng", "Đang cân nhắc"],
    ["Nhà gái thăm nhà trai", "Chúng mình", "Trước 3–5 tháng", "Đang cân nhắc"],
    ["Mua quần áo mới cho ba mẹ", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Mời dòng họ tham dự", "Gia đình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Dọn dẹp nhà cửa", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Mua bánh, trái cây, trà nước", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Grab car 2 chiều", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Quà cho nhà trai", "Em", "Trước 3–5 tháng", "Chưa có gì"],
  ],
  "Lên plan": [
    ["Chụp pre-wedding", "Chúng mình", "Trước 3–5 tháng", "Đã tìm đơn vị"],
    ["Lễ dạm ngõ", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Lễ ăn hỏi", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Lễ vu quy", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Lễ thành hôn", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Tuần trăng mật", "Chúng mình", "Trước 2 tháng", "Chưa có gì"],
    ["Makeup test", "Em", "Trước 2 tháng", "Đang cân nhắc"],
  ],
  "Chụp pre-wedding": [
    ["Book studio / photo lẻ", "Em", "Trước 1 tháng", "Đã tìm đơn vị"],
    ["Hoa cưới theo concept", "Em", "Trước 1 tháng", "Đã tìm đơn vị"],
    ["Makeup theo concept", "Em", "Trước 1 tháng", "Đã tìm đơn vị"],
    ["Váy / vest theo concept", "Chúng mình", "Trước 1 tháng", "Đã tìm đơn vị"],
    ["Xe di chuyển nội thành", "Em", "Trước 1 tháng", "Đã tìm đơn vị"],
    ["Homestay, nơi ăn uống", "Em", "Trước 1 tháng", "Chưa có gì"],
    ["Giặt hấp quần áo sau chuyến đi", "Em", "Trước 1 tháng", "Chưa có gì"],
  ],
  "Lễ dạm ngỏ": [
    ["Book studio / photo lẻ", "Em", "Trước 1 tháng", "Đang cân nhắc"],
    ["Tự decor gia tiên và nhà", "Gia đình", "Trước 1 tháng", "Đang cân nhắc"],
    ["Tự makeup", "Em", "Trước 1 tháng", "Đã tìm đơn vị"],
    ["Mua áo dài cho mình", "Em", "Trước 1 tháng", "Chưa có gì"],
    ["Mua sơ mi & quần tây cho anh", "Anh", "Trước 1 tháng", "Chưa có gì"],
    ["Mua quần áo mới cho ba mẹ", "Em", "Trước 1 tháng", "Chưa có gì"],
    ["Mời anh chị và cháu tham dự", "Chúng mình", "Trước 1 tháng", "Chưa có gì"],
    ["Mời dòng họ tham dự", "Gia đình", "Trước 1 tháng", "Chưa có gì"],
    ["Chuẩn bị trà, nước suối, bánh, trái cây", "Em", "Trước 1 tháng", "Chưa có gì"],
    ["Cúng kiến gia tiên", "Gia đình", "Trước 1 tháng", "Chưa có gì"],
    ["Mua nailbox, phụ kiện tóc", "Em", "Trước 1 tháng", "Chưa có gì"],
    ["Tiệc sau dạm ngỏ", "Chúng mình", "Trước 1 tháng", "Chưa có gì"],
    ["Di chuyển grab car", "Chúng mình", "Trước 1 tháng", "Chưa có gì"],
  ],
  "Lễ ăn hỏi": [
    ["Book studio / photo lẻ", "Em", "Trước 1 tháng", "Chưa có gì"],
    ["Book decor", "Anh", "Trước 1 tháng", "Chưa có gì"],
    ["Book makeup", "Em", "Trước 1 tháng", "Chưa có gì"],
    ["Vest cho anh", "Anh", "Trước 1 tháng", "Chưa có gì"],
    ["Váy cho em", "Em", "Trước 1 tháng", "Chưa có gì"],
    ["Tráp ăn hỏi", "Gia đình", "Trước 1 tháng", "Chưa có gì"],
    ["Khách mời ăn hỏi", "Gia đình", "Trước 1 tháng", "Chưa có gì"],
    ["Tiệc sau ăn hỏi", "Chúng mình", "Trước 1 tháng", "Chưa có gì"],
    ["Bạn bè hỗ trợ bưng quả", "Chúng mình", "Trước 1 tháng", "Chưa có gì"],
    ["Áo dài dàn tráp", "Chúng mình", "Trước 1 tháng", "Chưa có gì"],
    ["Xe di chuyển", "Chúng mình", "Trước 1 tháng", "Chưa có gì"],
  ],
  "Lễ vu quy": [
    ["Book studio / photo lẻ", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Book decor", "Anh", "Trước 3–5 tháng", "Chưa có gì"],
    ["Book makeup", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Vest cho anh", "Anh", "Trước 3–5 tháng", "Chưa có gì"],
    ["Áo dài cho em", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Tráp vu quy", "Gia đình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Khách mời vu quy", "Gia đình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Kịch bản vu quy", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Bạn bè hỗ trợ bưng quả", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["MC dẫn vu quy", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Book makeup cho mẹ", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Trang phục cho ba mẹ", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Xe di chuyển", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Hoa cưới theo concept", "Em", "Trước 3–5 tháng", "Chưa có gì"],
  ],
  "Lễ thành hôn": [
    ["Book studio / photo lẻ", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Book decor", "Anh", "Trước 3–5 tháng", "Chưa có gì"],
    ["Book makeup", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Vest cho anh", "Anh", "Trước 3–5 tháng", "Chưa có gì"],
    ["Áo dài cho em", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Nhẫn, hoa cưới, nạp tài", "Gia đình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Khách mời thành hôn", "Gia đình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Kịch bản thành hôn", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["MC dẫn thành hôn", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Trang trí phòng tân hôn", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Xe di chuyển", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
  ],
  "Tiệc nhà gái": [
    ["Book studio / photo lẻ", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Book decor", "Anh", "Trước 3–5 tháng", "Chưa có gì"],
    ["Book makeup", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Khách mời tiệc", "Gia đình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Kịch bản tiệc, trò chơi", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["MC dẫn tiệc", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Đặt menu, nhà hàng", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
  ],
  "Tiệc nhà trai": [
    ["Book studio / photo lẻ", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Book decor", "Anh", "Trước 3–5 tháng", "Chưa có gì"],
    ["Book makeup", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Khách mời tiệc", "Gia đình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Kịch bản tiệc, trò chơi", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["MC dẫn tiệc", "Em", "Trước 3–5 tháng", "Chưa có gì"],
    ["Đặt menu, nhà hàng", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
  ],
  "Tiệc thân mật": [
    ["Đặt homestay", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Lễ vows", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Quà cho khách mời", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
    ["Đặt menu, nhà hàng", "Chúng mình", "Trước 3–5 tháng", "Chưa có gì"],
  ],
  "Tuần trăng mật": [
    ["Đặt khách sạn, nhà hàng", "Chúng mình", "Trước 2 tháng", "Chưa có gì"],
    ["Đặt vé máy bay", "Chúng mình", "Trước 2 tháng", "Chưa có gì"],
    ["Quà cho gia đình", "Chúng mình", "Trước 2 tháng", "Chưa có gì"],
  ],
  "Giấy tờ": [
    ["Báo cơ quan xin phép", "Chúng mình", "Trước 1 tháng", "Chưa có gì"],
    ["Đăng ký kết hôn", "Chúng mình", "Trước 1 tháng", "Chưa có gì"],
  ],
};

// Hạng mục ngân sách mẫu (đồng) — sửa trong web
const SEED_BUDGET_CATS = {
  "Chụp pre-wedding": 25e6,
  "Thăm nhà": 5e6,
  "Dạm ngỏ": 15e6,
  "Lễ ăn hỏi": 40e6,
  "Lễ vu quy": 50e6,
  "Lễ thành hôn": 55e6,
  "Khác": 10e6,
};

// [khoản chi, hạng mục, người chi, chi phí, đã trả]
const SEED_EXPENSES = [
  ["Mời cô bác nhà nội (dạm ngỏ)", "Dạm ngỏ", "Gia đình", 500000, 500000],
  ["Đồ riêng để mặc nhiều lần, vali", "Chụp pre-wedding", "Tiền mình"],
  ["Vest chú rể 2 bộ", "Chụp pre-wedding", "Tiền chồng"],
  ["Makeup cô dâu 2 layout", "Chụp pre-wedding", "Tiền mình"],
  ["Hoa cầm tay cô dâu", "Chụp pre-wedding", "Tiền mình"],
  ["Mua quần áo cho ba và mẹ", "Thăm nhà", "Tiền mình"],
  ["Quần áo dạm ngỏ cho ba mẹ", "Dạm ngỏ", "Tiền mình"],
  ["Nhãn in, bảng thông báo", "Dạm ngỏ", "Tiền chồng"],
  ["Nước suối, nước ngọt", "Dạm ngỏ", "Tiền chồng"],
  ["Hoa trang trí bàn", "Dạm ngỏ", "Tiền mình"],
  ["Bánh kẹo đãi khách", "Dạm ngỏ", "Tiền chồng"],
  ["Đãi tiệc 2 bàn", "Dạm ngỏ", "Tiền mình"],
  ["Bàn ghế thuê", "Dạm ngỏ", "Tiền chồng"],
  ["Chụp dạm ngỏ", "Dạm ngỏ", "Tiền chồng"],
  ["Phóng sự cưới", "Lễ vu quy", "Tiền mình"],
  ["Makeup cho mẹ và mình", "Lễ vu quy", "Tiền mình"],
  ["Decor gia tiên nhà gái", "Lễ vu quy", "Tiền mình"],
  ["Phóng sự cưới", "Lễ thành hôn", "Tiền mình"],
  ["Thuê combo váy cưới x2", "Lễ thành hôn", "Tiền mình"],
  ["Makeup cho mẹ và mình", "Lễ thành hôn", "Tiền mình"],
  ["Decor gia tiên nhà trai", "Lễ thành hôn", "Tiền mình"],
  ["Thuê combo vest cưới", "Lễ thành hôn", "Tiền chồng"],
  ["Voan cưới", "Khác", "Tiền mình", 200000, 200000],
];

// Khách mẫu (tên giả). Danh sách thật nằm ở private/khach-that.js — không đưa lên git.
// "lễ|nhóm": [số khách, số người đã gửi thiệp]
const SEED_GUESTS_BRIDE = {
  "Lễ ăn hỏi|Bạn bè": [7, 7],
  "Tiệc nhà gái|Bạn thân": [7, 7],
  "Tiệc nhà gái|Bạn đại học": [8, 8],
  "Tiệc nhà gái|Bạn cấp 3": [15, 14],
  "Tiệc nhà gái|Bạn cấp 2": [8, 8],
  "Tiệc nhà gái|Bạn ở làng": [22, 9],
  "Tiệc nhà gái|Công ty": [37, 37],
  "Tiệc nhà gái|Người nhà": [13, 3],
  "Tiệc nhà gái|Khác": [9, 5],
};

// Tab "5. LỄ DẠM NGỎ" — phân công trong gia đình
SEED_CATEGORIES["Dạm ngỏ · phân công gia đình"] = [
  ["Mời cô bác nhà nội", "Ba", "", "Chưa có gì"], ["Mời cô bác nhà ngoại", "Mẹ", "", "Chưa có gì"],
  ["Trái cây và quà sức khỏe", "Anh hai", "", "Chưa có gì"], ["Dọn dẹp bàn thờ", "Anh hai", "", "Chưa có gì"],
  ["Mua hoa, đồ cúng", "Chị hai", "", "Chưa có gì"], ["Đặt bánh", "Em", "", "Chưa có gì"],
  ["Mua áo dài", "Em", "", "Chưa có gì"], ["Sắm đồ cho ba", "Anh hai", "", "Chưa có gì"],
  ["Sắm đồ cho mẹ", "Chị hai", "", "Chưa có gì"], ["Grab di chuyển", "Em", "", "Chưa có gì"],
  ["Tặng quà nhà trai", "Ba", "", "Chưa có gì"], ["Chụp ảnh lưu niệm", "Anh hai", "", "Chưa có gì"],
];

// Các lễ: [tên, ngày (yyyy-mm-dd), lễ chính?]
const SEED_EVENTS = [
  ["Lễ dạm ngỏ", ""], ["Lễ ăn hỏi", ""], ["Lễ vu quy", ""], ["Tiệc nhà gái", ""],
  ["Tiệc nhà trai", ""], ["Lễ thành hôn", "2027-10-26", true], ["Tiệc thân mật", ""],
];

const SEED_PEOPLE = ["Chúng mình", "Em", "Anh", "Gia đình", "Ba", "Mẹ", "Anh hai", "Chị hai"];

// Tab 1.2 — [mục, loại, phụ trách, tình trạng, nơi đăng ký, ghi chú]
const SEED_PROCEDURES = [
  ["Đăng ký kết hôn", "Giấy tờ", "Chúng mình", "Đang tìm hiểu", "UBND phường/xã", ""],
  ["Khám sức khỏe tổng quát", "Sức khỏe", "Chúng mình", "Chưa có gì", "", "Kèm tư vấn tiền sản"],
  ["Khóa học tiền hôn nhân", "Học", "Chúng mình", "Chưa có gì", "Unica (online)", "Lớp tiền hôn nhân Unica"],
  ["Tiêm ngừa sức khỏe sinh sản", "Sức khỏe", "Em", "Chưa có gì", "", ""],
  ["Bảo hiểm thai sản", "Bảo hiểm", "Em", "Chưa có gì", "", ""],
  ["Tiêm ngừa HPV", "Sức khỏe", "Em", "Hoàn tất", "", ""],
  ["Bảo hiểm y tế", "Bảo hiểm", "Chúng mình", "Hoàn tất", "", ""],
];
const SEED_REG_DOCS = [
  ["Tờ khai đăng ký kết hôn", "Lấy tại UBND hoặc điền online"],
  ["CCCD của hai người", "Bản gốc"],
  ["Giấy xác nhận tình trạng hôn nhân", "Khi đăng ký ở nơi không cư trú"],
  ["Hai người cùng có mặt", "Để ký và nhận giấy"],
];

// Tab 2.x — nhà cung cấp: [hạng mục, đơn vị, mô tả / ưu điểm, giá (đồng), tình trạng]
const VENDOR_CATS = ["Studio · phóng sự", "Makeup", "Nhẫn cưới", "Decor · tráp · hoa", "Nhà hàng · menu", "Xe hoa · bưng quả",
  "Váy & phụ kiện cô dâu", "Vest chú rể", "Trang phục bố mẹ", "Thiệp cưới", "Nail · spa · salon"];
const SEED_VENDORS = [
  ["Studio · phóng sự", "Tú Juli", "Nước ảnh đẹp, gần nhà", 11900000, "Đặt cọc"],
  ["Studio · phóng sự", "Jeju Wedding", "Album cưới đẹp", 0, "Đã liên hệ"],
  ["Studio · phóng sự", "Soha", "Nước ảnh đẹp, giá tốt", 0, "Đã liên hệ"],
  ["Studio · phóng sự", "Anh Khôi", "Linh hoạt", 0, "Đã liên hệ"],
  ["Studio · phóng sự", "Phi Long", "Phóng sự đẹp", 0, "Đã liên hệ"],
  ["Studio · phóng sự", "PSC Kiên Cường", "Phóng sự đẹp", 0, "Đã liên hệ"],
  ["Makeup", "Mai Tít", "Hà Nội · make dâu cưới, hỏi", 5000000, "Đã liên hệ"],
  ["Makeup", "Bình Kê", "Hà Nội · make dâu cưới", 3500000, "Loại"],
  ["Makeup", "Nhung Coy", "Phú Thọ · dạm ngõ, ăn hỏi", 2000000, "Loại"],
  ["Makeup", "Chị Huyền", "Ba Vì · make mẹ, họ hàng", 0, "Xem xét liên hệ"],
  ["Makeup", "Chị Duyên", "Ba Vì · make mẹ, họ hàng", 0, "Xem xét liên hệ"],
  ["Nhẫn cưới", "PNJ", "Mẫu mã đẹp", 0, "Đã liên hệ"],
  ["Nhẫn cưới", "Huy Thanh", "Giá tốt", 0, "Đã liên hệ"],
  ["Nhẫn cưới", "DOJI", "Giá tốt", 0, "Đã liên hệ"],
  ["Nhẫn cưới", "Tiệm gần nhà", "", 0, "Đã liên hệ"],
  ["Nhẫn cưới", "Tiera", "Nhẫn đặc lòng, mẫu mã đẹp", 0, "Đã liên hệ"],
  ["Decor · tráp · hoa", "Việt Hà", "Gia tiên", 0, "Đã liên hệ"],
  ["Decor · tráp · hoa", "Dũng Hường", "Gia tiên", 0, "Đã liên hệ"],
  ["Decor · tráp · hoa", "Cô Ngọc Vân An Thái", "Gia tiên", 0, "Đã liên hệ"],
];

// Tab "KỊCH BẢN TIỆC THÂN MẬT" — [phần, giờ, hoạt động, phút, nhạc, khoảnh khắc chính]
const SEED_SCRIPT = [
  [1, "16:30", "Khách tới, check-in và chụp hình ở khu đón khách", 20, ""],
  [1, "16:50", "Ca sĩ hát mở màn", 5, "Golden Hour"],
  [1, "16:55", "MC giới thiệu nghệ sĩ violon biểu diễn", 5, ""],
  [1, "17:00", "MC mời khách vào vị trí, chuẩn bị bắt đầu", 5, ""],
  [1, "17:05", "MC chào, kể câu chuyện tình yêu của cặp đôi", 5, ""],
  [1, "", "Giới thiệu ba mẹ hai bên và người thân", 0, ""],
  [1, "17:10", "Chú rể lên sân khấu, MC phỏng vấn 1–2 câu", 5, ""],
  [1, "", "Cô dâu bước vào lối đi — violon biểu diễn", 0, "", true],
  [1, "17:15", "Cặp đôi chào ra mắt và đọc lời thề (vows)", 15, "", true],
  [1, "17:30", "Trao nhẫn cưới — MC đọc ý nghĩa nghi thức", 5, "", true],
  [1, "17:35", "Cặp đôi xúc kem", 5, ""],
  [1, "17:40", "Bố mẹ hai bên trao quà, bố chú rể phát biểu", 10, ""],
  [1, "17:50", "Hai bạn thân lên chia sẻ, gửi lời chúc", 10, ""],
  [1, "18:00", "Cặp đôi bước những bước đầu tiên — mời khách sang khu tiệc", 10, ""],
  [2, "18:10", "Ca sĩ hát, cô dâu thay đồ đi tiệc", 10, "Một đời · Yêu em hơn mỗi ngày"],
  [2, "18:20", "Bật sâm panh khai tiệc, MC mời dùng tiệc", 0, ""],
  [2, "", "Nhạc nhẹ: violon", 0, ""],
  [2, "19:30", "Party và mini game", 0, ""],
];

// Tab "BTC VÀ HẬU CẦN" — [vai trò, số người, bồi dưỡng/người]
const SEED_TEAM = [["Dâu phụ", 1, 200000], ["Rể phụ", 1, 200000], ["Bưng quả", 13, 200000], ["Hướng dẫn bàn tiệc", 3, 400000]];

// Tab 2.11 — nhạc cưới
const SEED_MUSIC = {
  "Đón khách": ["Beautiful in White – Shane Filan", "Marry You – Bruno Mars", "A Thousand Years – Christina Perri", "Perfect – Ed Sheeran",
    "Thinking Out Loud – Ed Sheeran", "Nothing’s Gonna Change My Love For You – George Benson", "Until I Found You – Stephen Sanchez", "Can’t Help Falling In Love – Elvis Presley"],
  "Nghi lễ": ["Canon in D – Pachelbel", "River Flows In You – Yiruma", "You Are The Reason – Calum Scott & Leona Lewis", "I Get to Love You – Ruelle",
    "From This Moment On – Shania Twain", "All of Me – John Legend", "Rewrite The Stars – The Greatest Showman", "Golden Hour – JVKE"],
  "Tiệc": ["Sugar – Maroon 5", "Just The Way You Are – Bruno Mars", "Fly Me To The Moon – Frank Sinatra", "Love Me Like You Do – Ellie Goulding",
    "Lover – Taylor Swift", "Can’t Take My Eyes Off You – Frankie Valli", "Happy – Pharrell Williams", "Hơn cả yêu – Đức Phúc"],
};

// Tab "VIỆC SAU CƯỚI"
const SEED_AFTER = ["Mua sắm nội thất", "Đăng ký kết hôn", "Bồi dưỡng gia đình, vợ/chồng", "Xin nghỉ phép tuần trăng mật",
  "Hoàn cọc các hạng mục", "Mua sắm quần áo mới", "Sắp xếp thời gian biểu", "Mua xe mới"];
