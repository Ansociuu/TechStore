
import { Product, User } from './types';

export const MOCK_USER: User = {
  name: "Đạt Nguyễn",
  email: "dat.nguyen@email.com",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH4yVze214xUWhLjdxBSu9W7WULFBGY8F5vwYo3SW-iWPq_NJZH_dsXgkXCmVppnTO2vkXGBJKOxR5xkBQ4nK-DW18IcVYANHz_Veer973NOA927RGtLJ-8t5zIdszxzyn6jV-kSilQwB9k1S44Qmfa2hWWMBmlPFq63P4UI9K6qCPtdeQap60hWT2UjGsN-4tprL_wC1zxLjiT18R5UP6kiLSwdu6ryZzNxTrCW1Tjsyoeb_JAXm8Kd6vF6dKBkXiqHqiBKe_38s",
  rank: 'Platinum',
  phone: "0987654321",
  birthday: "1995-05-15",
  gender: 'male',
  addresses: [
    {
      id: 'addr-1',
      name: 'Đạt Nguyễn',
      phone: '0987654321',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      detail: '123 Lê Lợi',
      isDefault: true,
      type: 'home'
    },
    {
      id: 'addr-2',
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      ward: 'Phường Dịch Vọng',
      detail: 'Toà nhà ABC, tầng 10',
      isDefault: false,
      type: 'office'
    }
  ]
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "MacBook Air M2 13 inch",
    category: "Laptop",
    price: 26990000,
    originalPrice: 28990000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgM_IqWuVLCwggCd7Vf5zSxRmqCgpZ8N5tw195Xx2Rxv1AYb3n6glXiLBMGk8Rb49nRix6P03oz3_wrllxgdxwCzIT93rW2aAXqvr8mt4wPM8bVfHODT1FasGB1wV6l09zfaYL9QXx2hVoNm-nByAy-RAU7YNlHlNVSnwz8B7XYZVMbkyB8Nq0hVl1rfw4w3kryVLdPm7HThvlTUVULYBacle0oBzN-OYb2CLQEonA1ID98CUz6iRrrbHFppnrjHoXEQQ_BUsmQN4",
    rating: 4.9,
    reviewCount: 1240,
    isNew: true,
    isAIPick: true,
    aiReasoning: "Lựa chọn tốt nhất cho công việc văn phòng và di chuyển nhờ chip M2 mạnh mẽ.",
    description: "MacBook Air với chip M2 mang lại hiệu năng kinh ngạc trong một thiết kế siêu mỏng nhẹ.",
    specs: {
      "Chip": "Apple M2 8-core",
      "RAM": "8GB Unified Memory",
      "SSD": "256GB SSD Storage",
      "Màn hình": "13.6\" Liquid Retina"
    }
  },
  {
    id: "p2",
    name: "iPhone 16 Pro Max",
    category: "Smartphone",
    price: 34990000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmKo5j1aGHXWniKAl5-Q5LWbPx6bmGOzVsATX8J0Z6NsheJzE6dcFYhNjpOvMGKUG_wJUbaGgDYLiaprgPgk1WZyKkyAdOzEEjLlaefJFzvgg4wsp1vHdL-iQzOKL25VK-NqB-zCvznar3SYjXrKAH6TR18epn7y1C3ANV1wOa3AHd93hiJkiNNfBj9M4Gv6zo7X58E-mFGmiyW4eR_aRraPjUOXyrbhDXOjAMe6gl-MyY9CJkhkPTBYPnZw1xFTCGnAFUbqy-vcg",
    rating: 5.0,
    reviewCount: 3500,
    isHot: true,
    description: "Titan Tự Nhiên. Chip A17 Pro mạnh mẽ nhất. Thiết kế nhẹ hơn, bền bỉ hơn.",
    specs: {
      "Chip": "A17 Pro",
      "Màn hình": "6.7\" Super Retina XDR",
      "Chất liệu": "Titanium hạng hàng không"
    }
  },
  {
    id: "p3",
    name: "Sony WH-1000XM5",
    category: "Âm thanh",
    price: 8490000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKbraHIHckv38Qvn3MLh8uXfYs1vQXJoG0PI3WPKiV4KOZ2BHZpYvxXUV63NE-WyrEI4lf8HYv8RU6nFUdwfkgHKMFiNhpdLJg0EMQM9tbwszeG7kmH6QHAOAR9L9Vt4eRIXYsL5VkGeiEeLpBOolVqxFHaQI52cyPy6JdRaSZheR0htB2sMB0qkEs0MTmo8exdTuvQqCDBstyN9AQtlL4krteeRGaDOMBgTBZm6P5iOD0z1_JbZKqH3cU0bno7NGH8mZE0VYcD-E",
    rating: 4.8,
    reviewCount: 890,
    description: "Tai nghe chống ồn hàng đầu thế giới với chất âm Hi-Res Audio sắc nét.",
    specs: {
      "Chống ồn": "HD Noise Cancelling QN1",
      "Thời lượng pin": "30 giờ",
      "Kết nối": "Bluetooth 5.2"
    }
  },
  {
    id: "p4",
    name: "Logitech MX Master 3S",
    category: "Phụ kiện",
    price: 2190000,
    discount: "-15%",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6fnnApC-_P42jyZl2HXFy2zZcs68VOb-PGrRqJGD4nz3uOqKFSqN6eV14P8VnvMhHvvCxmx60vXleUBJ0b21EoDtfxihh70BC_zfzbJqKf4bLVa1wY4po5sIedopCSxnS0RpXvx6xjuq5C2QUUUM2jhjL7E_hVpZmi6wP1Gcul2LbMUdYqci3zd-QTunvT75F87j8MieniY6w8WwAINsEDZ3oWfJBd0aw1yKGL3_zcGRap3k3huBh54c0IK7mrr-hJ1wxX-vHXh0",
    rating: 4.7,
    reviewCount: 450,
    description: "Chuột không dây tối ưu cho hiệu suất với cảm biến 8000 DPI.",
    specs: {
      "Cảm biến": "8000 DPI Darkfield",
      "Nút cuộn": "MagSpeed Electromagnetic",
      "Sạc": "USB-C"
    }
  },
  {
    id: "p5",
    name: "iPad Pro M2 11 inch",
    category: "Tablet",
    price: 20490000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgcpSl3wefGyLD8QEFCCfrkFsHVW51uK0Z15g6FyUvurfzRFztMtjAu6ROzKLes8oHmjF5tw6qddSEH-C8QmrgRNrdXHKP5kdjw6IqpRHsrP3o8NrF8m-X-qkquVqzvnctpgnnGuaBaVi8EDK-2-UR9TWAYzHL0vN467cs21W_SJJU9kqqCsidDs241RdL6mRll4AgarkU31dO6Ar7Lo35py5DKIc2-yjiKQ6Hks_2zJJ-izUiu98J9FFz2kb5srOXqBgE3OcXK_U",
    rating: 4.9,
    reviewCount: 230,
    isNew: true,
    description: "Mạnh mẽ vượt trội với chip M2. Trải nghiệm iPad hoàn hảo nhất.",
    specs: {
      "Chip": "Apple M2",
      "Màn hình": "Liquid Retina 120Hz",
      "Kết nối": "Wi-Fi 6E"
    }
  },
  {
    id: "p6",
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphone",
    price: 30990000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDk99rcEGlkIl0zNfpOphc6TWBAFpcnb6065LGjxiTHvILSJM9T_uvNi78UguIbITvXaHu9Tl3s9xfpT7j6Ri8y7GA3EnFEFB9wOfx286nQ2q9TYjJUSeHGVls26xvSGeUbdfgVnymSS9wuI73yuKax0cI-CKKDmb02zjYYw4IU_3Pi6P28YYbJ0dYpSq1__zL5q9ePXqLqOYVAQHCU9HM-1Nxyct3z22umsFhIe2IMG01LNMdcVER4zLh0Vda8hLen1HIVjNSmy0",
    rating: 4.9,
    reviewCount: 2100,
    description: "Kỷ nguyên AI trên điện thoại di động với camera 200MP.",
    specs: {
      "Chip": "Snapdragon 8 Gen 3 for Galaxy",
      "Camera": "200MP Main Lens",
      "S Pen": "Tích hợp sẵn"
    }
  },
  {
    id: "p7",
    name: "Apple Watch Series 9",
    category: "Phụ kiện",
    price: 10190000,
    originalPrice: 11990000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz7lrmiJiE9FjRzFmZRy__lGi42JnYX69Kk5tziaSjs5zPYPIOB-48oL-uoWC-JNjVQUSPNLXWf4jZSo2H6wP92JxJGQnV-2SrTHrq9XMwyFuZBaeBP6UyDGkfbM9MH_84al4rzCRKXGgMWNPVfUd6FcSAivPriT0OFB-f0ZA3rm_Rw6jH8joPGYdA0-YV2pAWyUhoakVSeu62rH8hFM0yAN9dVISuh2GzBn_JQ2W_DS-Uz_N0xszoiRweq7irIpOh04GmlurG1gU",
    rating: 4.8,
    reviewCount: 420,
    description: "Thông minh hơn, sáng hơn, mạnh mẽ hơn với chip S9 SiP.",
    specs: {
      "Chip": "S9 SiP",
      "Độ sáng": "2000 nits",
      "Tính năng": "Chạm hai lần (Double Tap)"
    }
  },
  {
    id: "p8",
    name: "JBL Charge 5",
    category: "Âm thanh",
    price: 3490000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArRrMfn03sksGmM1BH3K8pnYvqog7N6_taCAvKRa1SZ73I2Uvz07Rfemle4dDV1IB09_6ewgg6B6VQU7_53t7P0yXQwg4vlKHKAemh6MRkt0ngaLY-R3NfE8TTgPAg6fQ81RuGKnL9rSRRCpmMe--Vvx8Zgpbwxlc439GTE_wz5eNaxrFpbXjRmRmv9yOef5pvjXtqj_UYeIduP6LXCjIYSol5bQbDpd9R8ybcZAmnoccduVxM6EIWRqMg-ViWQj70hb9x-VBpn3E",
    rating: 4.7,
    reviewCount: 1500,
    description: "Âm thanh JBL Original Pro mạnh mẽ, chống nước IP67.",
    specs: {
      "Công suất": "40W RMS",
      "Chống nước": "IP67 Waterproof & Dustproof",
      "Thời lượng pin": "20 giờ"
    }
  }
];
