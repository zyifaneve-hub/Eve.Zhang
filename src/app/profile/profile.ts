import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="px-6 max-w-7xl mx-auto pt-8">
      <section class="mb-16">
        <div class="flex flex-col md:flex-row items-center md:items-end gap-8">
          <div class="relative group">
            <div class="w-40 h-40 rounded-full overflow-hidden border-2 border-primary/20 p-1">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB973z5m_Umo8wRZO5jgorIIjWJn8hVUaH0vU0SWo02ilX5BvEppKJmxbjYFKihLEM3ccds3DksCZatL3YcCCBQGhb-B_MotGSlTJtAiogL3JWHVoZ67nRBJa-0NQjBoqTRrFIghoc7TQTbQrSAX7Mj7VDWfzRPL6o04vmClFI9NZCJSi5H676ARrQnPEAs48EsO6UEXB2zEEpSvXjmtREFJR30u3yjDLprDWJIWAAu4sfk-lztmqUVWzSG3v0fD5UPWXoc2Mn_KAEf" alt="Audiophile Prime" class="w-full h-full object-cover rounded-full filter grayscale contrast-125" referrerpolicy="no-referrer" />
            </div>
            <div class="absolute -bottom-2 -right-2 bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface">
              <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
            </div>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h1 class="font-headline text-3xl md:text-5xl font-black tracking-tight mb-2 text-on-surface uppercase">Audiophile Prime</h1>
            <div class="flex flex-wrap justify-center md:justify-start items-center gap-4 text-on-surface/60 font-medium">
              <span class="px-3 py-1 bg-surface-container-high rounded-full text-xs tracking-widest uppercase border border-on-surface/5">Elite Collector</span>
              <span class="flex items-center gap-1 text-primary">
                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">star</span>
                Collector Reputation: 99%
              </span>
              <span class="text-xs uppercase tracking-widest">Est. 2021</span>
            </div>
          </div>
          <div class="flex gap-4 w-full md:w-auto">
            <button class="flex-1 md:flex-none px-8 py-3 bg-surface-container-high text-on-surface rounded-full font-headline text-xs font-bold uppercase tracking-widest border border-on-surface/10 hover:bg-surface-bright transition-all active:scale-95">
              编辑资料
            </button>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <a routerLink="/crate" class="group relative block w-full overflow-hidden rounded-2xl bg-surface-container-low border border-on-surface/5 p-8 transition-all hover:bg-surface-container-high">
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">library_music</span>
              </div>
              <div>
                <h2 class="font-headline text-xl md:text-2xl font-bold uppercase tracking-tight text-on-surface">我的虚拟唱片箱</h2>
                <p class="text-on-surface/40 font-body text-sm mt-1">浏览您收藏的 1,284 张精品黑胶唱片</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-primary/40 group-hover:text-primary group-hover:translate-x-2 transition-all">arrow_forward_ios</span>
          </div>
          <div class="absolute -right-20 -top-20 opacity-5 group-hover:opacity-10 transition-opacity">
            <span class="material-symbols-outlined text-[240px]">album</span>
          </div>
        </a>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside class="lg:col-span-3 space-y-2">
          <h3 class="font-headline text-xs font-bold text-on-surface/30 uppercase tracking-[0.2em] mb-6 px-4">Account Overview</h3>
          <nav class="flex flex-col gap-1">
            <a href="#" class="flex items-center gap-4 px-4 py-4 rounded-xl bg-primary/10 text-primary font-headline font-bold border-l-4 border-primary transition-all">
              <span class="material-symbols-outlined">shopping_bag</span>
              订单历史
            </a>
          </nav>
        </aside>

        <section class="lg:col-span-9">
          <div class="flex items-center justify-between mb-8 border-b border-on-surface/5">
            <div class="flex gap-12 relative">
              <button 
                (click)="activeTab.set('buying')"
                class="pb-4 border-b-2 font-headline font-bold uppercase tracking-widest text-sm transition-all duration-300"
                [class]="activeTab() === 'buying' ? 'border-primary text-on-surface' : 'border-transparent text-on-surface/40 hover:text-on-surface'">
                正在买入
              </button>
              <button 
                (click)="activeTab.set('selling')"
                class="pb-4 border-b-2 font-headline font-bold uppercase tracking-widest text-sm transition-all duration-300"
                [class]="activeTab() === 'selling' ? 'border-primary text-on-surface' : 'border-transparent text-on-surface/40 hover:text-on-surface'">
                正在卖出
              </button>
            </div>
            <div class="pb-4">
              <span class="material-symbols-outlined text-on-surface/40 cursor-pointer hover:text-primary transition-colors">filter_list</span>
            </div>
          </div>
          
          <div class="relative min-h-[300px]">
            @if (activeTab() === 'buying') {
              <div class="absolute inset-0 flex flex-col items-center justify-center py-20 opacity-20 animate-fade-in-up">
                <span class="material-symbols-outlined text-6xl mb-4">inbox</span>
                <p class="font-headline uppercase tracking-widest text-sm font-bold">暂无买入数据</p>
              </div>
            } @else {
              <div class="absolute inset-0 flex flex-col items-center justify-center py-20 opacity-20 animate-fade-in-up">
                <span class="material-symbols-outlined text-6xl mb-4">outbox</span>
                <p class="font-headline uppercase tracking-widest text-sm font-bold">暂无卖出数据</p>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
    
    <div class="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-10">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
    </div>
  `
})
export class ProfileComponent {
  activeTab = signal<'buying' | 'selling'>('buying');
}
