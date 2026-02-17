const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

describe('Comment Deletion Security', () => {
    let adminToken, userToken, otherUserToken;
    let userId, otherUserId;
    let postId, commentId;

    beforeAll(async () => {
        // Create Users
        const admin = await User.create({ username: 'admin_test', email: 'admin_test@test.com', password: 'password123', role: 'admin' });
        adminToken = admin.getSignedJwtToken();

        const user = await User.create({ username: 'user_test', email: 'user_test@test.com', password: 'password123', role: 'user' });
        userId = user._id;
        userToken = user.getSignedJwtToken();

        const otherUser = await User.create({ username: 'other_test', email: 'other_test@test.com', password: 'password123', role: 'user' });
        otherUserId = otherUser._id;
        otherUserToken = otherUser.getSignedJwtToken();

        // Create Post
        const post = await Post.create({ title: 'Test Post', content: 'Content', user: admin._id });
        postId = post._id;
    });

    afterAll(async () => {
        await User.deleteMany({ email: { $in: ['admin_test@test.com', 'user_test@test.com', 'other_test@test.com'] } });
        await Post.deleteMany({ _id: postId });
        await Comment.deleteMany({});
    });

    it('should allow author to delete comment within 10 seconds', async () => {
        const comment = await Comment.create({ content: 'Test Comment', post: postId, user: userId });
        
        const res = await request(app)
            .delete(`/api/comments/${comment._id}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should NOT allow author to delete comment after 10 seconds', async () => {
        const comment = await Comment.create({ content: 'Old Comment', post: postId, user: userId });
        
        // Mock createdAt to be older
        comment.createdAt = new Date(Date.now() - 15000); // 15 seconds ago
        await comment.save();

        const res = await request(app)
            .delete(`/api/comments/${comment._id}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(403); // Forbidden
        expect(res.body.error).toContain('10 seconds');
    });

    it('should NOT allow other users to delete comment', async () => {
        const comment = await Comment.create({ content: 'User Comment', post: postId, user: userId });

        const res = await request(app)
            .delete(`/api/comments/${comment._id}`)
            .set('Authorization', `Bearer ${otherUserToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toContain('Not authorized');
    });

    it('should allow admin to delete any comment anytime', async () => {
        const comment = await Comment.create({ content: 'User Comment', post: postId, user: userId });
        
        // Mock createdAt to be older
        comment.createdAt = new Date(Date.now() - 20000); // 20 seconds ago
        await comment.save();

        const res = await request(app)
            .delete(`/api/comments/${comment._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
