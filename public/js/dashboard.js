document.addEventListener('DOMContentLoaded', () => {
    // Handle delete post button click
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', async (event) => {
            const postId = event.target.getAttribute('data-post-id');
            
            try {
                const response = await fetch(`/api/posts/${postId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Remove the post from the dashboard or redirect/reload the page
                    location.reload();
                } else {
                    console.error('Failed to delete post.');
                }
            } catch (err) {
                console.error('Error: ', err);
            }
        });
    });
});