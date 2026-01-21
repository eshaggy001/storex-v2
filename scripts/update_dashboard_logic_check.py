import os

path = '/Users/sandagenkhbaatar/antigravity/storex-v2/components/DashboardOverview.tsx'
with open(path, 'r') as f:
    text = f.read()

# 1. Add Mongolian Translations
mn_search = '            awaitingData: "Өгөгдөл хүлээж байна",'
mn_replace = '            awaitingData: "Өгөгдөл хүлээж байна",\n            analyticsUnavailable: "Аналитик харах боломжгүй",\n            connectToSee: "IG/FB холбож дата харах",'
text = text.replace(mn_search, mn_replace)

# 2. Add English Translations
en_search = '         shippingReady: "Ready to Ship",'
# Note: I need to be careful with the English object structure.
# Let's verify English structure from previous view
# It has "setup: {" inside en object?
# View file output step 245 shows "setup: {" is in 'mn' object (lines 57-67).
# lines 77 starts 'en'. I need to see if 'en' has 'setup' object.
# I will check 'en' object structure first.
