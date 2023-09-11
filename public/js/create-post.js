// create-post.js

document.addEventListener('DOMContentLoaded', () => {
    const newPostForm = document.getElementById('new-post-form');

    newPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify({ title, content }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                location.href = '/dashboard'; // Redirect to dashboard after successful creation
            } else {
                console.error('Failed to create post.');
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    });
});