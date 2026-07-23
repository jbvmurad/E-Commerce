// Mock data for the e-commerce application

export type ProductStatus = 'Active' | 'Inactive' | 'OutOfStock';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  price: number;
  stockQuantity: number;
  status: ProductStatus;
  description: string;
  specifications?: Record<string, string>;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  categoryName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  orderDate: string;
  totalAmount: number;
  shippingAddress: string;
  status: OrderStatus;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  avatar?: string;
  roles: string[];
  joinDate: string;
}

export interface Role {
  id: number;
  name: string;
}

// Mock Categories
export const mockCategories: Category[] = [
  { id: 1, name: 'Electronics', icon: 'Monitor' },
  { id: 2, name: 'Fashion', icon: 'Shirt' },
  { id: 3, name: 'Home & Living', icon: 'Home' },
  { id: 4, name: 'Sports & Outdoors', icon: 'Dumbbell' },
  { id: 5, name: 'Books & Media', icon: 'Book' },
  { id: 6, name: 'Beauty & Health', icon: 'Sparkles' },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    categoryId: 1,
    categoryName: 'Electronics',
    price: 299.99,
    stockQuantity: 45,
    status: 'Active',
    description: 'Experience premium sound quality with these wireless headphones featuring active noise cancellation and 30-hour battery life.',
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Warranty': '2 years'
    }
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    categoryId: 1,
    categoryName: 'Electronics',
    price: 449.99,
    stockQuantity: 30,
    status: 'Active',
    description: 'Track your fitness and stay connected with this advanced smartwatch.',
    specifications: {
      'Display': '1.4" AMOLED',
      'Water Resistant': '5 ATM',
      'Battery': '5 days'
    }
  },
  {
    id: 3,
    name: 'Designer Leather Bag',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    categoryId: 2,
    categoryName: 'Fashion',
    price: 199.99,
    stockQuantity: 20,
    status: 'Active',
    description: 'Elegant leather bag perfect for any occasion.',
  },
  {
    id: 4,
    name: 'Classic Sunglasses',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    categoryId: 2,
    categoryName: 'Fashion',
    price: 129.99,
    stockQuantity: 0,
    status: 'OutOfStock',
    description: 'Timeless style with UV protection.',
  },
  {
    id: 5,
    name: 'Modern Table Lamp',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    categoryId: 3,
    categoryName: 'Home & Living',
    price: 79.99,
    stockQuantity: 15,
    status: 'Active',
    description: 'Illuminate your space with this modern design.',
  },
  {
    id: 6,
    name: 'Ceramic Vase Set',
    imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400',
    categoryId: 3,
    categoryName: 'Home & Living',
    price: 59.99,
    stockQuantity: 8,
    status: 'Active',
    description: 'Beautiful handcrafted ceramic vases.',
  },
  {
    id: 7,
    name: 'Yoga Mat Premium',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    categoryId: 4,
    categoryName: 'Sports & Outdoors',
    price: 39.99,
    stockQuantity: 50,
    status: 'Active',
    description: 'Non-slip yoga mat for your practice.',
  },
  {
    id: 8,
    name: 'Running Shoes Elite',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    categoryId: 4,
    categoryName: 'Sports & Outdoors',
    price: 159.99,
    stockQuantity: 25,
    status: 'Active',
    description: 'Lightweight running shoes for optimal performance.',
  },
  {
    id: 9,
    name: 'Bestseller Novel Collection',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    categoryId: 5,
    categoryName: 'Books & Media',
    price: 29.99,
    stockQuantity: 100,
    status: 'Active',
    description: 'Collection of award-winning novels.',
  },
  {
    id: 10,
    name: 'Organic Skincare Set',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    categoryId: 6,
    categoryName: 'Beauty & Health',
    price: 89.99,
    stockQuantity: 35,
    status: 'Active',
    description: 'Natural and organic skincare products.',
  },
  {
    id: 11,
    name: 'Bluetooth Speaker',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    categoryId: 1,
    categoryName: 'Electronics',
    price: 79.99,
    stockQuantity: 60,
    status: 'Active',
    description: 'Portable speaker with amazing sound quality.',
  },
  {
    id: 12,
    name: 'Vintage Camera',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
    categoryId: 1,
    categoryName: 'Electronics',
    price: 499.99,
    stockQuantity: 5,
    status: 'Inactive',
    description: 'Classic film camera for photography enthusiasts.',
  },
];

// Mock Roles
export const mockRoles: Role[] = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'User' },
  { id: 3, name: 'Manager' },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    phoneNumber: '+1-555-0101',
    avatar: 'https://i.pravatar.cc/150?u=1',
    roles: ['Admin', 'User'],
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    phoneNumber: '+1-555-0102',
    avatar: 'https://i.pravatar.cc/150?u=2',
    roles: ['User'],
    joinDate: '2024-02-20'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.j@example.com',
    username: 'mikej',
    phoneNumber: '+1-555-0103',
    avatar: 'https://i.pravatar.cc/150?u=3',
    roles: ['Manager', 'User'],
    joinDate: '2024-03-10'
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    userId: 1,
    orderDate: '2024-05-01',
    totalAmount: 529.98,
    shippingAddress: '123 Main St, New York, NY 10001',
    status: 'Delivered',
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Premium Wireless Headphones',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        unitPrice: 299.99,
        quantity: 1,
        totalPrice: 299.99
      },
      {
        id: 2,
        productId: 3,
        productName: 'Designer Leather Bag',
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
        unitPrice: 199.99,
        quantity: 1,
        totalPrice: 199.99
      },
    ]
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    userId: 1,
    orderDate: '2024-05-03',
    totalAmount: 449.99,
    shippingAddress: '123 Main St, New York, NY 10001',
    status: 'Shipped',
    items: [
      {
        id: 3,
        productId: 2,
        productName: 'Smart Watch Pro',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        unitPrice: 449.99,
        quantity: 1,
        totalPrice: 449.99
      },
    ]
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    userId: 2,
    orderDate: '2024-05-05',
    totalAmount: 199.97,
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    status: 'Confirmed',
    items: [
      {
        id: 4,
        productId: 7,
        productName: 'Yoga Mat Premium',
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        unitPrice: 39.99,
        quantity: 2,
        totalPrice: 79.98
      },
      {
        id: 5,
        productId: 9,
        productName: 'Bestseller Novel Collection',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        unitPrice: 29.99,
        quantity: 4,
        totalPrice: 119.96
      },
    ]
  },
  {
    id: 4,
    orderNumber: 'ORD-2024-004',
    userId: 1,
    orderDate: '2024-05-06',
    totalAmount: 159.99,
    shippingAddress: '123 Main St, New York, NY 10001',
    status: 'Pending',
    items: [
      {
        id: 6,
        productId: 8,
        productName: 'Running Shoes Elite',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        unitPrice: 159.99,
        quantity: 1,
        totalPrice: 159.99
      },
    ]
  },
];

// Mock Cart
export const mockCart: CartItem[] = [
  {
    id: 1,
    productId: 5,
    productName: 'Modern Table Lamp',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    categoryName: 'Home & Living',
    unitPrice: 79.99,
    quantity: 1,
    totalPrice: 79.99
  },
  {
    id: 2,
    productId: 10,
    productName: 'Organic Skincare Set',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    categoryName: 'Beauty & Health',
    unitPrice: 89.99,
    quantity: 2,
    totalPrice: 179.98
  },
];
