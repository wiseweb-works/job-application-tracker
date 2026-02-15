import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)

        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass

        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:3000
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # -> Type 'NonexistentCo' into the search input (index 6) to trigger a no-results state.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/main/div/div/div[1]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NonexistentCo')
        
        # -> Clear the search input to restore the applications list, then verify the applications are visible again.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/main/div/div/div[1]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        
        # -> Trigger a search submission/update after clearing the input so the applications list refreshes (click the search input (index 6) and press Enter).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/main/div/div/div[1]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Clear the search input (index 6) and submit the search (press Enter) so the applications list refreshes and verify the application cards reappear.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=html/body/main/div/div/div[1]/div[1]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        
        # -> Navigate to the applications page without the search query (http://localhost:3000/applications) to force the list to refresh, then verify application cards are visible.
        await page.goto("http://localhost:3000/applications", wait_until="commit", timeout=10000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        # -> Final assertions according to the test plan
        frame = context.pages[-1]
        # Give the UI a moment to settle
        await page.wait_for_timeout(1000)
        # 1) Verify the applications list is visible by checking for a known job item
        apps_item = frame.locator("text=Mobile Developer").nth(0)
        assert await apps_item.is_visible(), "Applications list is not visible: 'Mobile Developer' not found"
        
        # 2) Verify the no-results/empty state is shown for the non-matching search term
        # (look for the exact text 'No results')
        no_results = frame.locator("text=No results")
        await page.wait_for_timeout(500)
        assert await no_results.is_visible(), "Expected 'No results' message for non-matching search term"
        
        # 3) Verify clearing the search restores the applications list (check for another known job item)
        # Ensure final navigation/update has completed
        await page.wait_for_timeout(1000)
        frame = context.pages[-1]
        restored_item = frame.locator("text=Frontend Engineer").nth(0)
        assert await restored_item.is_visible(), "Applications list did not restore after clearing search: 'Frontend Engineer' not found"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    