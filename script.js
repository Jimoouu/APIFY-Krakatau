const API_URL = 'https://api.apify.com/v2/datasets/sqOEpw7rbsHD3h0av/items?token=apify_api_qFSsdWA35qSBc06XPJ0Jc91Bty7Reg2YVFJj';

const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const commentsList = document.getElementById('comments-list');

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

async function fetchApifyData() {
    try {
        // Simulasi delay sedikit biar animasi loading sempat kelihatan (bisa dihapus kalau mau instan)
        await new Promise(resolve => setTimeout(resolve, 800));

        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || data.length === 0) {
            throw new Error('Dataset kosong. Belum ada komentar yang berhasil di-scrape.');
        }

        renderComments(data);
        
    } catch (error) {
        console.error("Gagal:", error);
        showError(error.message);
    }
}

function renderComments(commentsArray) {
    loadingState.style.display = 'none';
    commentsList.classList.remove('hidden');

    let htmlContent = '';

    commentsArray.forEach((comment, index) => {
        const commentText = comment.text || comment.comment || "Sticker/Kosong";
        
        let username = "Netizen";
        let tag = "@netizen"
        if (comment.user && comment.user.nickname) {
            username = comment.user.nickname;
            tag = "@" + (comment.user.uniqueId || username.toLowerCase().replace(/\s/g, ''));
        } else if (comment.uniqueId) {
            username = comment.uniqueId;
            tag = "@" + comment.uniqueId;
        }
        
        let avatarUrl = `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=128`;
        if (comment.user && comment.user.avatarThumb) avatarUrl = comment.user.avatarThumb;
        else if (comment.authorMeta && comment.authorMeta.avatar) avatarUrl = comment.authorMeta.avatar;

        const likes = comment.diggCount || comment.likes || Math.floor(Math.random() * 500);
        const formattedLikes = formatNumber(likes);

        const animDelay = (index * 0.1).toFixed(1);

        htmlContent += `
            <div class="glass-panel glass-card-hover rounded-[1.25rem] p-4 sm:p-5 flex gap-3 sm:gap-4 opacity-0 animate-fade-in-up relative overflow-hidden group" style="animation-delay: ${animDelay}s">
                
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div class="relative shrink-0">
                    <img src="${avatarUrl}" alt="${username}" onerror="this.src='https://ui-avatars.com/api/?name=User&background=334155&color=fff'" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/10 ring-2 ring-transparent group-hover:ring-orange-500/30 transition-all">
                </div>
                
                <div class="flex-1 min-w-0 flex flex-col justify-center pt-0.5">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="font-bold text-slate-100 text-[15px] truncate leading-none">${username}</h4>
                        <span class="text-slate-500 text-xs truncate leading-none">${tag}</span>
                    </div>
                    
                    <p class="text-slate-300 text-[15px] leading-relaxed mb-3 pr-2">
                        ${commentText}
                    </p>

                    <div class="flex items-center gap-5 text-slate-400 mt-auto">
                        <button class="flex items-center gap-1.5 hover:text-red-500 transition-colors group/btn">
                            <div class="p-1.5 rounded-full group-hover/btn:bg-red-500/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <span class="text-xs font-semibold">${formattedLikes}</span>
                        </button>
                        
                        <button class="flex items-center gap-1.5 hover:text-blue-400 transition-colors group/btn">
                            <div class="p-1.5 rounded-full group-hover/btn:bg-blue-400/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <span class="text-xs font-semibold">Balas</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    commentsList.innerHTML = htmlContent;
}

function showError(msg) {
    loadingState.style.display = 'none';
    errorState.classList.remove('hidden');
    errorState.classList.add('flex');
    errorMessage.textContent = msg;
}

window.addEventListener('DOMContentLoaded', () => {
    fetchApifyData();
});