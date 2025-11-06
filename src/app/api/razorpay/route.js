
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        const { amount, currency } = await request.json();
        const options = {
            amount, // amount in the smallest currency unit
            currency,
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await instance.orders.create(options);
        
        if (!order) {
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        return NextResponse.json(order, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");
            
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Here you would typically update your database that the payment was successful
            return NextResponse.json({ success: true, message: 'Payment successful' }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
