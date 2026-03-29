import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Order {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: string;
  condition: string;
  image: string;
  status: string;
  statusColor: string;
  date: string;
}

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
            <a routerLink="/edit-profile" class="flex-1 md:flex-none px-8 py-3 bg-surface-container-high text-on-surface rounded-full font-headline text-xs font-bold uppercase tracking-widest border border-on-surface/10 hover:bg-surface-bright transition-all active:scale-95 text-center flex items-center justify-center">
              编辑资料
            </a>
            <a routerLink="/sell" class="flex-1 md:flex-none px-8 py-3 bg-primary text-on-primary rounded-full font-headline text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 text-center flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-sm">add_circle</span>
              出售唱片
            </a>
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
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-on-surface/5 gap-4 md:gap-0">
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
            <div class="flex items-center gap-4 pb-4 md:pb-4">
              <div class="relative group flex-1 md:flex-none">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 group-focus-within:text-primary transition-colors">
                  <span class="material-symbols-outlined text-sm">search</span>
                </span>
                <input type="text" placeholder="搜索订单..."
                  class="w-full md:w-48 bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-9 pr-4 text-sm focus:border-primary focus:ring-0 outline-none transition-all focus:md:w-64"
                  [value]="searchQuery()"
                  (input)="onSearchInput($event)"
                />
              </div>
              <span class="material-symbols-outlined text-on-surface/40 cursor-pointer hover:text-primary transition-colors shrink-0">filter_list</span>
              @if (activeTab() === 'selling') {
                <a routerLink="/sell" class="hidden md:flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition-colors uppercase tracking-widest ml-2">
                  <span class="material-symbols-outlined text-sm">add</span>
                  发布
                </a>
              }
            </div>
          </div>
          
          <div class="min-h-[300px]">
            @if (activeTab() === 'buying') {
              @if (filteredBuyingOrders().length > 0) {
                <div class="flex flex-col gap-4 animate-fade-in-up">
                  @for (order of filteredBuyingOrders(); track order.id) {
                    <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-on-surface/5 hover:bg-surface-container-high transition-all cursor-pointer group">
                      <div class="flex items-center gap-4 flex-1 min-w-0">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
                          <img [src]="order.image" [alt]="order.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerpolicy="no-referrer">
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-headline font-bold text-sm sm:text-base truncate mb-1 group-hover:text-primary transition-colors">{{order.title}}</h4>
                          <p class="text-xs text-on-surface/60 truncate mb-2">{{order.artist}}</p>
                          <div class="flex gap-2">
                            <span class="text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface/80 font-bold">{{order.format}}</span>
                            <span class="text-[10px] px-2 py-0.5 rounded border border-outline-variant text-on-surface/80 font-bold">{{order.condition}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-on-surface/5 shrink-0 sm:w-32">
                        <span class="font-headline font-extrabold text-base">¥{{order.price}}</span>
                        <span class="text-[10px] px-2 py-1 rounded-full font-bold tracking-wider" [class]="order.statusColor">{{order.status}}</span>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="flex flex-col items-center justify-center py-20 opacity-20 animate-fade-in-up">
                  <span class="material-symbols-outlined text-6xl mb-4">search_off</span>
                  <p class="font-headline uppercase tracking-widest text-sm font-bold">没有找到相关买入订单</p>
                </div>
              }
            } @else {
              @if (filteredSellingOrders().length > 0) {
                <div class="flex flex-col gap-4 animate-fade-in-up">
                  @for (order of filteredSellingOrders(); track order.id) {
                    <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-on-surface/5 hover:bg-surface-container-high transition-all cursor-pointer group">
                      <div class="flex items-center gap-4 flex-1 min-w-0">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
                          <img [src]="order.image" [alt]="order.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerpolicy="no-referrer">
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-headline font-bold text-sm sm:text-base truncate mb-1 group-hover:text-primary transition-colors">{{order.title}}</h4>
                          <p class="text-xs text-on-surface/60 truncate mb-2">{{order.artist}}</p>
                          <div class="flex gap-2">
                            <span class="text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface/80 font-bold">{{order.format}}</span>
                            <span class="text-[10px] px-2 py-0.5 rounded border border-outline-variant text-on-surface/80 font-bold">{{order.condition}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-on-surface/5 shrink-0 sm:w-32">
                        <span class="font-headline font-extrabold text-base">¥{{order.price}}</span>
                        <span class="text-[10px] px-2 py-1 rounded-full font-bold tracking-wider" [class]="order.statusColor">{{order.status}}</span>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="flex flex-col items-center justify-center py-20 opacity-20 animate-fade-in-up">
                  <span class="material-symbols-outlined text-6xl mb-4">search_off</span>
                  <p class="font-headline uppercase tracking-widest text-sm font-bold">没有找到相关卖出订单</p>
                </div>
              }
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
  searchQuery = signal('');

  buyingOrders = signal<Order[]>([
    { id: 'B1001', title: 'The Dark Side of the Moon', artist: 'Pink Floyd', price: 280, format: 'Vinyl', condition: 'NM', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVlPnZW90i9sqd6y-J-W6IZFjRd9RY3SOl7jysCyHL3ZyiXIlYwht7012lAkD4F8V72AwPbmUO9gn9_MQl91a26mhEysAbOsDHIZqHnxFAEfTJ38mlCLaeVOc4-U7EUQB5Ngzz6CrVz0K0Ew2SUf-3WrNIpXQR0dmeWTRg9cnOwJwpRSbg2CQvlXo0v6Qj5GlIiB-T30j3LRteQZEhpOGzB18EGvcDiTAJhLc5kZNZT9jfkoOUZF-zHbCIxDjRyo1pYOSKSTuskH0g', status: '运输中', statusColor: 'text-blue-500 bg-blue-500/10', date: '2026-03-28' },
    { id: 'B1002', title: 'Random Access Memories', artist: 'Daft Punk', price: 315, format: 'Vinyl', condition: 'VG+', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwvSqg8xEb6bipZmGJpzr7vg1VbIbl9x5WVNcPrPqcv4G8WWFemnrarrGBILFNUk-0uCNc1190O1Bws-e-p4R7Difvy_09jRcZQtRv5FOyEw1CsWst4VMTb9BK1Moa_SwNFByfyqQbgrOnPhGYLWev4LQ3exd197DFcX_IlMQKBHDeLhgfkPcbDAYzuy3Ybg6jqbqqzyHTxmfTkq8lw9m9_XqLnjk5_tExXDBBP_1gtO1-XPPfMLdG9TDVJYWz2Z7-yXZnau5UD1t1', status: '待发货', statusColor: 'text-amber-500 bg-amber-500/10', date: '2026-03-27' }
  ]);

  sellingOrders = signal<Order[]>([
    { id: 'S1001', title: 'Unknown Pleasures', artist: 'Joy Division', price: 450, format: 'Cassette', condition: 'VG+', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWTFppcWEiW8QzsWF1ya0gdu-7i-uON-MZ6RdJBSluzfXvfqxRxJl25uw-GVcMP4qrTKdRlIstxEDuLLz5DLfxdksMc4uSYnc-k6YRnOgNoNwtOmETeMO7mUmNy0ZMUpzJMDUMwAcO4WGd5rr2Ga-o0D6vdX5QYUDsdcBqE1_AzD8i3N9Ome4E9pltkGzrymiAGF3hfJoYY9LGLDGIUgZ26_l8TA8XCdN67RHPoU0wGwWsf4DKca6Qc9TqgbGM98SCZ919f9Ic2Sx5', status: '等待付款', statusColor: 'text-orange-500 bg-orange-500/10', date: '2026-03-29' },
    { id: 'S1002', title: 'Kind of Blue', artist: 'Miles Davis', price: 2400, format: 'Vinyl', condition: 'NM', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2duI1hU6GRkF9afI15orOuJs0lBfn4aoZRpnnkkV07Di0AR8GJal9SVkF6PeB4TaShpmcKGd0ZaqnmzLG704ZZZRbtY3s65LBU0Vzz-H7bPZG-F3t_Jl6lv1lVvgmd055nK4LuR-SRTYHp3kLQZdFSxEjnx-NBjXX0nVC7kh38is2upTd02f4p61piUhsDcwaavqhi_ZIMYNtaaic6ZEqO8yurgrExxqC3VpWEZHRTv2yNMCdhHHRj1UrBPtqKsw8x1NT1s0d4VTG', status: '已发货', statusColor: 'text-emerald-500 bg-emerald-500/10', date: '2026-03-26' }
  ]);

  filteredBuyingOrders = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.buyingOrders().filter(o =>
      o.title.toLowerCase().includes(query) || o.artist.toLowerCase().includes(query)
    );
  });

  filteredSellingOrders = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.sellingOrders().filter(o =>
      o.title.toLowerCase().includes(query) || o.artist.toLowerCase().includes(query)
    );
  });

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
