// Dữ liệu 63 tỉnh/thành phố Việt Nam
export const VN_PROVINCES = [
    { id: '01', name: 'Thành phố Hà Nội' },
    { id: '02', name: 'Tỉnh Hà Giang' },
    { id: '04', name: 'Tỉnh Cao Bằng' },
    { id: '06', name: 'Tỉnh Bắc Kạn' },
    { id: '08', name: 'Tỉnh Tuyên Quang' },
    { id: '10', name: 'Tỉnh Lào Cai' },
    { id: '11', name: 'Tỉnh Điện Biên' },
    { id: '12', name: 'Tỉnh Lai Châu' },
    { id: '14', name: 'Tỉnh Sơn La' },
    { id: '15', name: 'Tỉnh Yên Bái' },
    { id: '17', name: 'Tỉnh Hoà Bình' },
    { id: '19', name: 'Tỉnh Thái Nguyên' },
    { id: '20', name: 'Tỉnh Lạng Sơn' },
    { id: '22', name: 'Tỉnh Quảng Ninh' },
    { id: '24', name: 'Tỉnh Bắc Giang' },
    { id: '25', name: 'Tỉnh Phú Thọ' },
    { id: '26', name: 'Tỉnh Vĩnh Phúc' },
    { id: '27', name: 'Tỉnh Bắc Ninh' },
    { id: '30', name: 'Tỉnh Hải Dương' },
    { id: '31', name: 'Thành phố Hải Phòng' },
    { id: '33', name: 'Tỉnh Hưng Yên' },
    { id: '34', name: 'Tỉnh Thái Bình' },
    { id: '35', name: 'Tỉnh Hà Nam' },
    { id: '36', name: 'Tỉnh Nam Định' },
    { id: '37', name: 'Tỉnh Ninh Bình' },
    { id: '38', name: 'Tỉnh Thanh Hóa' },
    { id: '40', name: 'Tỉnh Nghệ An' },
    { id: '42', name: 'Tỉnh Hà Tĩnh' },
    { id: '44', name: 'Tỉnh Quảng Bình' },
    { id: '45', name: 'Tỉnh Quảng Trị' },
    { id: '46', name: 'Thành phố Huế' },
    { id: '48', name: 'Thành phố Đà Nẵng' },
    { id: '49', name: 'Tỉnh Quảng Nam' },
    { id: '51', name: 'Tỉnh Quảng Ngãi' },
    { id: '52', name: 'Tỉnh Bình Định' },
    { id: '54', name: 'Tỉnh Phú Yên' },
    { id: '56', name: 'Tỉnh Khánh Hòa' },
    { id: '58', name: 'Tỉnh Ninh Thuận' },
    { id: '60', name: 'Tỉnh Bình Thận' },
    { id: '62', name: 'Tỉnh Kon Tum' },
    { id: '64', name: 'Tỉnh Gia Lai' },
    { id: '66', name: 'Tỉnh Đắk Lắk' },
    { id: '67', name: 'Tỉnh Đắk Nông' },
    { id: '68', name: 'Tỉnh Lâm Đồng' },
    { id: '70', name: 'Tỉnh Bình Phước' },
    { id: '72', name: 'Tỉnh Tây Ninh' },
    { id: '74', name: 'Tỉnh Bình Dương' },
    { id: '75', name: 'Tỉnh Đồng Nai' },
    { id: '77', name: 'Tỉnh Bà Rịa - Vũng Tàu' },
    { id: '79', name: 'Thành phố Hồ Chí Minh' },
    { id: '80', name: 'Tỉnh Long An' },
    { id: '82', name: 'Tỉnh Tiền Giang' },
    { id: '83', name: 'Tỉnh Bến Tre' },
    { id: '84', name: 'Tỉnh Trà Vinh' },
    { id: '86', name: 'Tỉnh Vĩnh Long' },
    { id: '87', name: 'Tỉnh Đồng Tháp' },
    { id: '89', name: 'Tỉnh An Giang' },
    { id: '91', name: 'Tỉnh Kiên Giang' },
    { id: '92', name: 'Thành phố Cần Thơ' },
    { id: '93', name: 'Tỉnh Hậu Giang' },
    { id: '94', name: 'Tỉnh Sóc Trăng' },
    { id: '95', name: 'Tỉnh Bạc Liêu' },
    { id: '96', name: 'Tỉnh Cà Mau' },
];

/**
 * Fetch districts for a given province ID from the Open API
 */
export const fetchDistricts = async (provinceId: string) => {
    if (!provinceId) return [];
    try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
        if (!response.ok) throw new Error('Failed to fetch districts');
        const data = await response.json();
        return data.districts.map((d: any) => ({
            id: d.code.toString(),
            name: d.name
        }));
    } catch (error) {
        console.error('Error fetching districts:', error);
        return [];
    }
};

/**
 * Fetch wards for a given district ID from the Open API
 */
export const fetchWards = async (districtId: string) => {
    if (!districtId) return [];
    try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);
        if (!response.ok) throw new Error('Failed to fetch wards');
        const data = await response.json();
        return data.wards.map((w: any) => ({
            id: w.code.toString(),
            name: w.name
        }));
    } catch (error) {
        console.error('Error fetching wards:', error);
        return [];
    }
};
