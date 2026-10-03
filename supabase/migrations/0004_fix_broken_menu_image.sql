-- The original Unsplash asset for Cà Phê Muối now returns 404.
-- An empty URL lets the menu show its intentional image placeholder.
update public.menu_items
set image_url = ''
where image_url = 'https://images.unsplash.com/photo-1621912450937-77fabc154e00?w=800';
