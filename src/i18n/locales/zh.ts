const zh: Record<string, string> = {
  // ============================================
  // Homepage
  // ============================================
  'home.title.ai': 'AI',
  'home.title.murder-mystery': '\u5267\u672c\u6740',
  'home.subtitle': '\u6d3e\u51fa\u4f60\u7684 AI \u8fdb\u5165\u4e00\u573a\u81f4\u547d\u7684\u6b3a\u9a97\u6e38\u620f\u3002',
  'home.subtitle2': '\u8c01\u80fd\u63ed\u5f00\u771f\u76f8\uff1f',
  'home.choose-script': '\u9009\u62e9\u5267\u672c',
  'home.how-it-works': '\u73a9\u6cd5\u8bf4\u660e',
  'home.step.01': '\u9009\u62e9\u5267\u672c',
  'home.step.02': '\u9080\u8bf7\u670b\u53cb',
  'home.step.03': '\u89c2\u770b AI \u6f14\u7ece',
  'home.step.04': '\u627e\u51fa\u51f6\u624b',
  'home.footer': 'Second Me A2A Hackathon 2026',
  'home.players': '{min}-{max} \u540d\u73a9\u5bb6',
  'home.scenes': '{count} \u4e2a\u573a\u666f',
  'home.roles': '{count} \u4e2a\u89d2\u8272',

  // ============================================
  // Room page
  // ============================================
  'room.loading': '\u52a0\u8f7d\u4e2d...',
  'room.creating': '\u521b\u5efa\u623f\u95f4\u4e2d...',
  'room.redirecting': '\u6b63\u5728\u8df3\u8f6c\u6388\u6743\u9875\u9762',

  // ============================================
  // Join page
  // ============================================
  'join.loading': '\u52a0\u8f7d\u9080\u8bf7\u4e2d...',
  'join.invited-you': '\u9080\u8bf7\u4f60\u52a0\u5165',
  'join.available-roles': '\u53ef\u9009\u89d2\u8272',
  'join.join-game': '\u52a0\u5165\u6e38\u620f',
  'join.auth-note': '\u6388\u6743\u540e\u4f60\u7684 AI \u5c06\u626e\u6f14\u4e00\u4e2a\u89d2\u8272',
  'join.create-own': '\u6216\u8005\u521b\u5efa\u81ea\u5df1\u7684\u623f\u95f4',

  // ============================================
  // Waiting page
  // ============================================
  'waiting.loading': '\u6b63\u5728\u8bbe\u7f6e\u623f\u95f4...',
  'waiting.choose-character': '\u9009\u62e9\u4f60\u7684\u89d2\u8272',
  'waiting.room-created': '\u623f\u95f4\u5df2\u521b\u5efa - \u9080\u8bf7\u73a9\u5bb6\u6216\u5f00\u59cb\u6e38\u620f',
  'waiting.players': '\u73a9\u5bb6',
  'waiting.ready': '\u5c31\u7eea',
  'waiting.waiting-player': '\u7b49\u5f85\u73a9\u5bb6\u52a0\u5165...',
  'waiting.needs-roles': '\u9700\u8981 {min}-{max} \u4e2a\u89d2\u8272',
  'waiting.ai-fills': '(AI \u586b\u5145\u5269\u4f59)',
  'waiting.invite-link': '\u9080\u8bf7\u94fe\u63a5',
  'waiting.copy': '\u590d\u5236',
  'waiting.copied': '\u5df2\u590d\u5236',
  'waiting.choose-role': '\u9009\u62e9\u89d2\u8272',
  'waiting.select-character': '\u9009\u62e9\u4f60\u7684\u89d2\u8272',
  'waiting.your-role': '\u4f60\u7684\u89d2\u8272',
  'waiting.taken': '\u5df2\u88ab\u9009',
  'waiting.ai-controlled': 'AI \u63a7\u5236\u7684\u89d2\u8272',
  'waiting.start-game': '\u5f00\u59cb\u6e38\u620f',
  'waiting.back-lobby': '\u8fd4\u56de\u5927\u5385',
  'waiting.home': '\u9996\u9875',

  // ============================================
  // Play page
  // ============================================
  'play.loading': '\u52a0\u8f7d\u5267\u672c\u4e2d...',
  'play.next-scene-transition': '\u4e0b\u4e00\u573a',
  'play.scene-label': '\u573a\u666f {n}: {title}',
  'play.ai-controls': 'AI \u63a7\u5236 {count} \u4e2a\u89d2\u8272',
  'play.ai-controls-plural': 'AI \u63a7\u5236 {count} \u4e2a\u89d2\u8272',
  'play.your-character': '\u4f60\u7684\u89d2\u8272',
  'play.scene-description': '\u573a\u666f\u63cf\u8ff0',
  'play.ai-roles': 'AI \u89d2\u8272',
  'play.ai-speaking': 'AI \u89d2\u8272\u6b63\u5728\u53d1\u8a00...',
  'play.begin-scene': '\u5f00\u59cb\u6b64\u573a\u666f',
  'play.generating': '\u751f\u6210\u4e2d...',
  'play.next-scene': '\u4e0b\u4e00\u573a',
  'play.cast-vote': '\u8fdb\u884c\u6295\u7968',
  'play.preparing': '\u51c6\u5907\u6e38\u620f\u4e2d...',
  'play.voice': '\u8bed\u97f3',
  'play.no-voice': '\u65e0\u8bed\u97f3',
  'play.playing': '\u64ad\u653e\u4e2d',
  'play.you': '\u4f60',
  'play.ai': 'AI',
  'play.who-is-killer': '\u8c01\u662f\u51f6\u624b\uff1f',
  'play.choose-wisely': '\u8c28\u614e\u9009\u62e9\u3002\u673a\u4f1a\u53ea\u6709\u4e00\u6b21\u3002',
  'play.someone-else': '\u5176\u4ed6\u4eba',
  'play.case-solved': '\u7834\u6848\u6210\u529f\uff01',
  'play.wrong-deduction': '\u63a8\u7406\u5931\u8bef\uff01',
  'play.reasoning-flawless': '\u4f60\u7684\u63a8\u7406\u5b8c\u7f8e\u65e0\u7f3a\u3002',
  'play.killer-escaped': '\u771f\u6b63\u7684\u51f6\u624b\u4ece\u4f60\u7684\u6307\u7f1d\u95f4\u6e9c\u8d70\u4e86\u3002',
  'play.real-killer': '\u771f\u6b63\u7684\u51f6\u624b',
  'play.save-result': '\u4fdd\u5b58\u7ed3\u679c',
  'play.play-again': '\u518d\u73a9\u4e00\u6b21',
  'play.revealing': '\u63ed\u5f00\u771f\u76f8\u4e2d...',
  'play.view-secret': '\u67e5\u770b\u79d8\u5bc6\u4fe1\u606f',
  'play.hide-secret': '\u9690\u85cf\u79d8\u5bc6\u4fe1\u606f',

  // ============================================
  // Script: twins-revenge (Chinese originals)
  // ============================================
  'script.twins-revenge.title': '\u53cc\u751f\u8c1c\u6848',
  'script.twins-revenge.description': '\u4e24\u4eba\u4e13\u5c5e\uff01\u53cc\u80de\u80ce\u5144\u5f1f\u7684\u590d\u4ec7\u4e4b\u591c...',
  'script.twins-revenge.background': '\u5348\u591c\u65f6\u5206\uff0c\u5bcc\u5546\u6797\u8001\u7237\u88ab\u53d1\u73b0\u6b7b\u5728\u81ea\u5df1\u7684\u8c6a\u5b85\u4e2d\u3002\n\u4ed6\u7684\u53cc\u80de\u80ce\u517b\u5b50\u2014\u2014\u6797\u8f69\u548c\u6797\u9038\u2014\u2014\u662f\u552f\u4e00\u5728\u573a\u7684\u4eba\u3002\n\u8b66\u65b9\u8d76\u5230\u524d\uff0c\u5144\u5f1f\u4e8c\u4eba\u5fc5\u987b\u5f04\u6e05\u771f\u76f8...\n\u4f46\u4ed6\u4eec\u4e4b\u95f4\u4e5f\u6709\u7740\u5404\u81ea\u7684\u79d8\u5bc6\u3002',

  // Characters
  'script.twins-revenge.char.lin-xuan.name': '\u6797\u8f69',
  'script.twins-revenge.char.lin-xuan.description': '\u53cc\u80de\u80ce\u4e2d\u7684\u54e5\u54e5\uff0c\u6c89\u7a33\u5185\u655b\u7684\u5f8b\u5e08\uff0c\u4e00\u76f4\u662f\u7236\u4eb2\u6700\u4fe1\u4efb\u7684\u4eba\u3002',
  'script.twins-revenge.char.lin-yi.name': '\u6797\u9038',
  'script.twins-revenge.char.lin-yi.description': '\u53cc\u80de\u80ce\u4e2d\u7684\u5f1f\u5f1f\uff0c\u653e\u8361\u4e0d\u7f81\u7684\u827a\u672f\u5bb6\uff0c\u4e0e\u7236\u4eb2\u5173\u7cfb\u758f\u8fdc\u3002',

  // Scenes
  'script.twins-revenge.scene.scene-1.title': '\u53d1\u73b0\u5c38\u4f53',
  'script.twins-revenge.scene.scene-2.title': '\u4e92\u76f8\u8d28\u95ee',
  'script.twins-revenge.scene.scene-3.title': '\u771f\u76f8\u5927\u767d',
  'script.twins-revenge.scene.scene-1.description': '\u7ba1\u5bb6\u5c16\u53eb\u58f0\u4f20\u6765\uff0c\u4f60\u4eec\u51b2\u8fdb\u4e66\u623f\uff0c\u53d1\u73b0\u7236\u4eb2\u5df2\u7ecf\u6b7b\u4e86...',
  'script.twins-revenge.scene.scene-2.description': '\u5728\u8b66\u5bdf\u5230\u6765\u4e4b\u524d\uff0c\u4f60\u4eec\u5fc5\u987b\u5f04\u6e05\u695a\u53d1\u751f\u4e86\u4ec0\u4e48\u3002',
  'script.twins-revenge.scene.scene-3.description': '\u7ebf\u7d22\u9010\u6e10\u6e05\u6670\uff1a\u6b7b\u4ea1\u65f6\u95f4\u662f9\u70b950\u5206\uff0c\u4f60\u4eec\u90fd\u6709\u4e0d\u5728\u573a\u8bc1\u660e...',

  // ============================================
  // Script: midnight-manor (Chinese originals)
  // ============================================
  'script.midnight-manor.title': '\u5348\u591c\u5e84\u56ed',
  'script.midnight-manor.description': '\u4e00\u573a\u66b4\u98ce\u96e8\u4e4b\u591c\uff0c\u5e84\u56ed\u4e3b\u4eba\u79bb\u5947\u6b7b\u4ea1...',
  'script.midnight-manor.background': '\u66b4\u98ce\u96e8\u4e4b\u591c\uff0c\u53e4\u8001\u7684\u5a01\u5ec9\u59c6\u65af\u5e84\u56ed\u3002\n\u5e84\u56ed\u4e3b\u4eba\u5a01\u5ec9\u7235\u58eb\u88ab\u53d1\u73b0\u6b7b\u5728\u4e66\u623f\uff0c\u95e8\u7a97\u7d27\u9501\uff0c\u73b0\u573a\u4e00\u7247\u6df7\u4e71\u3002\n\u6240\u6709\u5bbe\u5ba2\u90fd\u88ab\u56f0\u5728\u5e84\u56ed\u4e2d\uff0c\u51f6\u624b\u5c31\u5728\u4ed6\u4eec\u4e4b\u95f4...',

  // Characters
  'script.midnight-manor.char.butler.name': '\u7ba1\u5bb6\u963f\u5c14\u5f17\u96f7\u5fb7',
  'script.midnight-manor.char.butler.description': '\u670d\u52a1\u5a01\u5ec9\u7235\u58eb30\u5e74\u7684\u5fe0\u8bda\u7ba1\u5bb6\uff0c\u5bf9\u5e84\u56ed\u7684\u4e00\u5207\u4e86\u5982\u6307\u638c\u3002',
  'script.midnight-manor.char.heir.name': '\u7ee7\u627f\u4eba\u827e\u7c73\u4e3d',
  'script.midnight-manor.char.heir.description': '\u5a01\u5ec9\u7235\u58eb\u7684\u4f84\u5973\uff0c\u7f8e\u4e3d\u800c\u91ce\u5fc3\u52c3\u52c3\uff0c\u662f\u9057\u4ea7\u7684\u7b2c\u4e00\u7ee7\u627f\u4eba\u3002',
  'script.midnight-manor.char.doctor.name': '\u533b\u751f\u54c8\u91cc\u68ee',
  'script.midnight-manor.char.doctor.description': '\u5a01\u5ec9\u7235\u58eb\u7684\u79c1\u4eba\u533b\u751f\uff0c\u4e00\u4e2a\u6c89\u9ed8\u5be1\u8a00\u7684\u4e2d\u5e74\u4eba\u3002',
  'script.midnight-manor.char.maid.name': '\u5973\u4ec6\u9732\u897f',
  'script.midnight-manor.char.maid.description': '\u5e74\u8f7b\u7684\u5973\u4ec6\uff0c\u5728\u5e84\u56ed\u5de5\u4f5c\u4e86\u4e24\u5e74\uff0c\u770b\u8d77\u6765\u5929\u771f\u65e0\u90aa\u3002',

  // Scenes
  'script.midnight-manor.scene.scene-1.title': '\u53d1\u73b0\u5c38\u4f53',
  'script.midnight-manor.scene.scene-2.title': '\u4e92\u76f8\u8d28\u95ee',
  'script.midnight-manor.scene.scene-3.title': '\u6700\u7ec8\u9648\u8ff0',
  'script.midnight-manor.scene.scene-1.description': '\u6240\u6709\u4eba\u805a\u96c6\u5728\u5ba2\u5385\uff0c\u8b66\u63a2\u65e0\u6cd5\u5230\u8fbe\uff0c\u5fc5\u987b\u4e92\u76f8\u8c03\u67e5\u3002',
  'script.midnight-manor.scene.scene-2.description': '\u6bcf\u4e2a\u4eba\u5f00\u59cb\u4e92\u76f8\u8d28\u95ee\uff0c\u8bd5\u56fe\u627e\u51fa\u51f6\u624b\u7684\u7834\u7efd\u3002',
  'script.midnight-manor.scene.scene-3.description': '\u5728\u6295\u7968\u4e4b\u524d\uff0c\u6bcf\u4e2a\u4eba\u505a\u6700\u540e\u7684\u9648\u8ff0\u3002',

  // ============================================
  // Script: office-murder (Chinese originals)
  // ============================================
  'script.office-murder.title': '\u529e\u516c\u5ba4\u60ca\u9b42',
  'script.office-murder.description': 'CEO \u6df1\u591c\u88ab\u5bb3\uff0c\u5acc\u7591\u4eba\u90fd\u662f\u516c\u53f8\u9ad8\u7ba1...',
  'script.office-murder.background': '\u79d1\u6280\u516c\u53f8 TechNova \u7684 CEO \u5f20\u660e\u88ab\u53d1\u73b0\u6b7b\u5728\u529e\u516c\u5ba4\u3002\n\u76d1\u63a7\u663e\u793a\u5f53\u665a\u53ea\u6709\u56db\u540d\u9ad8\u7ba1\u7559\u5728\u516c\u53f8\u52a0\u73ed\u3002\n\u6bcf\u4e2a\u4eba\u90fd\u6709\u52a8\u673a\uff0c\u6bcf\u4e2a\u4eba\u90fd\u6709\u79d8\u5bc6...',

  // Characters
  'script.office-murder.char.cto.name': 'CTO \u674e\u4f1f',
  'script.office-murder.char.cto.description': '\u6280\u672f\u5929\u624d\uff0c\u516c\u53f8\u7684\u6280\u672f\u7075\u9b42\uff0c\u4f46\u6700\u8fd1\u4e0e CEO \u6709\u6fc0\u70c8\u4e89\u6267\u3002',
  'script.office-murder.char.cfo.name': 'CFO \u738b\u82b3',
  'script.office-murder.char.cfo.description': '\u7cbe\u660e\u7684\u8d22\u52a1\u603b\u76d1\uff0c\u638c\u63e1\u516c\u53f8\u6240\u6709\u8d22\u52a1\u79d8\u5bc6\u3002',
  'script.office-murder.char.hr.name': 'HR\u603b\u76d1 \u9648\u9759',
  'script.office-murder.char.hr.description': '\u4eba\u529b\u8d44\u6e90\u603b\u76d1\uff0c\u516c\u53f8\u91cc\u6700\u4e86\u89e3\u6bcf\u4e2a\u4eba\u79d8\u5bc6\u7684\u4eba\u3002',
  'script.office-murder.char.sales.name': '\u9500\u552e\u603b\u76d1 \u5218\u5f3a',
  'script.office-murder.char.sales.description': '\u9500\u552e\u51a0\u519b\uff0c\u91ce\u5fc3\u52c3\u52c3\uff0c\u4e00\u76f4\u60f3\u53d6\u4ee3 CEO \u7684\u4f4d\u7f6e\u3002',

  // Scenes
  'script.office-murder.scene.scene-1.title': '\u53d1\u73b0\u5c38\u4f53',
  'script.office-murder.scene.scene-2.title': '\u4e92\u76f8\u8d28\u95ee',
  'script.office-murder.scene.scene-3.title': '\u6700\u7ec8\u9648\u8ff0',
  'script.office-murder.scene.scene-1.description': '\u4fdd\u5b89\u53d1\u73b0 CEO \u7684\u5c38\u4f53\uff0c\u6240\u6709\u9ad8\u7ba1\u88ab\u53eb\u5230\u4f1a\u8bae\u5ba4\u3002',
  'script.office-murder.scene.scene-2.description': '\u8b66\u5bdf\u5230\u6765\u4e4b\u524d\uff0c\u9ad8\u7ba1\u4eec\u5f00\u59cb\u4e92\u76f8\u8d28\u95ee\u3002',
  'script.office-murder.scene.scene-3.description': '\u6295\u7968\u4e4b\u524d\u7684\u6700\u540e\u9648\u8ff0\u3002',
};

export default zh;
