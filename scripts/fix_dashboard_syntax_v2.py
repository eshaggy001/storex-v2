import os

path = '/Users/sandagenkhbaatar/antigravity/storex-v2/components/DashboardOverview.tsx'
with open(path, 'r') as f:
    text = f.read()

# Fix Conversations ternary - line 562
text = text.replace('                     ))}\n                     {conversations.length > 0 &&', '                     )))}\n                     {conversations.length > 0 &&')

# Fix Products ternary - line 623
# Note: Conversations.length was also mistakenly used in the products section in the previous script!
text = text.replace('                     ))}\n                     {conversations.length > 0 && <div className="h-2 w-full"></div>}', '                     )))}\n                     {topProducts.length > 0 && <div className="h-2 w-full"></div>}')

with open(path, 'w') as f:
    f.write(text)
