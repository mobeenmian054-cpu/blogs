export const blogs = [
    {
        id: 1,
        title: "The Future of Web Development",
        excerpt: "Discover the latest trends and technologies shaping the future of the web.",
        content: "Web development is constantly evolving. From the rise of AI-powered tools to the dominance of JavaScript frameworks, the landscape is changing fast. In this post, we explore what to expect in the coming years...",
        author: "John Doe",
        date: "October 10, 2023",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
        likes: 120,
        comments: [
            { id: 1, user: "Alice", text: "Great article! Really insightful." },
            { id: 2, user: "Bob", text: "I agree with the points about AI." }
        ]
    },
    {
        id: 2,
        title: "Mastering React Hooks",
        excerpt: "A comprehensive guide to understanding and using React Hooks effectively.",
        content: "React Hooks have revolutionized how we write React components. They allow us to use state and other React features without writing a class. This guide covers useState, useEffect, and custom hooks...",
        author: "Jane Smith",
        date: "November 5, 2023",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        likes: 85,
        comments: [
            { id: 1, user: "Charlie", text: "Very helpful tutorial, thanks!" }
        ]
    },
    {
        id: 3,
        title: "CSS Grid vs. Flexbox",
        excerpt: "When to use CSS Grid and when to use Flexbox? Let's find out.",
        content: "CSS Layouts can be tricky. Flexbox is great for one-dimensional layouts, while Grid excels at two-dimensional layouts. In this post, we compare them and show practical examples of when to use which...",
        author: "Mike Johnson",
        date: "December 1, 2023",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        likes: 200,
        comments: []
    }
];
